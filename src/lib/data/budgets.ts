import budgetsData from '@/data/budgets.json';
import { createClient } from '../supabase/client';
import { getCurrentUser, isGuestMode } from './auth';
import { getCurrentMonthTransactions } from './transactions';

// Budget functions
export const getCurrentUserBudgets = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  if (isGuestMode()) {
    return budgetsData.budgets.filter(budget => budget.userId === user.id);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }

    // Map database fields to our interface
    return (data || []).map(budget => ({
      id: budget.id,
      userId: budget.user_id,
      category: budget.category,
      budgetAmount: Number(budget.budget_amount),
      spentAmount: Number(budget.spent_amount),
      remainingAmount: Number(budget.remaining_amount),
      period: budget.period,
      startDate: budget.start_date,
      endDate: budget.end_date,
      createdAt: budget.created_at,
      updatedAt: budget.updated_at
    }));
  } catch (error) {
    console.error('Error in getCurrentUserBudgets:', error);
    return [];
  }
};

export const getBudgetsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return budgetsData.budgets.filter(budget => budget.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching budgets by user ID:', error);
      return [];
    }

    // Map database fields to our interface
    return (data || []).map(budget => ({
      id: budget.id,
      userId: budget.user_id,
      category: budget.category,
      budgetAmount: Number(budget.budget_amount),
      spentAmount: Number(budget.spent_amount),
      remainingAmount: Number(budget.remaining_amount),
      period: budget.period,
      startDate: budget.start_date,
      endDate: budget.end_date,
      createdAt: budget.created_at,
      updatedAt: budget.updated_at
    }));
  } catch (error) {
    console.error('Error in getBudgetsByUserId:', error);
    return [];
  }
};

// Calculate total monthly budget remaining
export const getMonthlyBudgetRemaining = async (): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) return 0;
  
  if (isGuestMode()) {
    const userBudgets = budgetsData.budgets.filter(budget => budget.userId === user.id);
    return userBudgets.reduce((total, budget) => total + (budget.remainingAmount || 0), 0);
  }
  
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('period', 'monthly')
      .gte('start_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('end_date', lastDayOfMonth.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching monthly budgets:', error);
      return 0;
    }

    // Calculate remaining amount for current month budgets
    return (data || []).reduce((total, budget) => {
      const remaining = Number(budget.remaining_amount) || 0;
      return total + remaining;
    }, 0);
  } catch (error) {
    console.error('Error calculating monthly budget remaining:', error);
    return 0;
  }
};

// Calculate real-time budget remaining based on actual spending
export const calculateRealTimeBudgetRemaining = async (): Promise<number> => {
  const user = await getCurrentUser();
  if (!user) return 0;
  
  if (isGuestMode()) {
    const userBudgets = budgetsData.budgets.filter(budget => budget.userId === user.id);
    return userBudgets.reduce((total, budget) => total + (budget.remainingAmount || 0), 0);
  }
  
  try {
    // Get current month transactions for expense calculation
    const monthlyTransactions = await getCurrentMonthTransactions();
    const monthlyExpenses = monthlyTransactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
    
    // Get current month budgets
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('period', 'monthly')
      .gte('start_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('end_date', lastDayOfMonth.toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching monthly budgets for calculation:', error);
      return 0;
    }

    // Calculate total budget amount
    const totalBudget = (data || []).reduce((total, budget) => {
      return total + Number(budget.budget_amount);
    }, 0);

    // Return remaining amount (budget - actual spending)
    return Math.max(0, totalBudget - monthlyExpenses);
  } catch (error) {
    console.error('Error calculating real-time budget remaining:', error);
    return 0;
  }
};

// Create a new budget
export const createBudget = async (budgetData: {
  category: string;
  budgetAmount: number;
  period: string;
  startDate: string;
  endDate: string;
  spentAmount?: number;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    throw new Error('Cannot create budgets in guest mode');
  }

  try {
    const supabase = createClient();
    const spentAmount = budgetData.spentAmount || 0;
    const remainingAmount = budgetData.budgetAmount - spentAmount;
    
    // Generate a unique ID for the budget
    const budgetId = `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('budgets')
      .insert({
        id: budgetId,
        user_id: user.id,
        category: budgetData.category,
        budget_amount: budgetData.budgetAmount,
        spent_amount: spentAmount,
        remaining_amount: remainingAmount,
        period: budgetData.period,
        start_date: budgetData.startDate,
        end_date: budgetData.endDate
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating budget:', error);
      throw new Error('Failed to create budget');
    }

    return {
      id: data.id,
      userId: data.user_id,
      category: data.category,
      budgetAmount: Number(data.budget_amount),
      spentAmount: Number(data.spent_amount),
      remainingAmount: Number(data.remaining_amount),
      period: data.period,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createBudget:', error);
    throw error;
  }
};

// Update an existing budget
export const updateBudget = async (budgetId: string, budgetData: {
  category?: string;
  budgetAmount?: number;
  spentAmount?: number;
  period?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    throw new Error('Cannot update budgets in guest mode');
  }

  try {
    const supabase = createClient();
    
    // Prepare update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (budgetData.category !== undefined) updateData.category = budgetData.category;
    if (budgetData.budgetAmount !== undefined) updateData.budget_amount = budgetData.budgetAmount;
    if (budgetData.spentAmount !== undefined) updateData.spent_amount = budgetData.spentAmount;
    if (budgetData.period !== undefined) updateData.period = budgetData.period;
    if (budgetData.startDate !== undefined) updateData.start_date = budgetData.startDate;
    if (budgetData.endDate !== undefined) updateData.end_date = budgetData.endDate;

    // Calculate remaining amount if budget or spent amount changed
    if (budgetData.budgetAmount !== undefined || budgetData.spentAmount !== undefined) {
      // Get current budget to calculate remaining amount
      const { data: currentBudget } = await supabase
        .from('budgets')
        .select('budget_amount, spent_amount')
        .eq('id', budgetId)
        .eq('user_id', user.id)
        .single();

      if (currentBudget) {
        const newBudgetAmount = budgetData.budgetAmount ?? Number(currentBudget.budget_amount);
        const newSpentAmount = budgetData.spentAmount ?? Number(currentBudget.spent_amount);
        updateData.remaining_amount = newBudgetAmount - newSpentAmount;
      }
    }

    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', budgetId)
      .eq('user_id', user.id) // Ensure user can only update their own budgets
      .select()
      .single();

    if (error) {
      console.error('Error updating budget:', error);
      throw new Error('Failed to update budget');
    }

    return {
      id: data.id,
      userId: data.user_id,
      category: data.category,
      budgetAmount: Number(data.budget_amount),
      spentAmount: Number(data.spent_amount),
      remainingAmount: Number(data.remaining_amount),
      period: data.period,
      startDate: data.start_date,
      endDate: data.end_date,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in updateBudget:', error);
    throw error;
  }
};

// Delete a budget
export const deleteBudget = async (budgetId: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    throw new Error('Cannot delete budgets in guest mode');
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budgetId)
      .eq('user_id', user.id); // Ensure user can only delete their own budgets

    if (error) {
      console.error('Error deleting budget:', error);
      throw new Error('Failed to delete budget');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBudget:', error);
    throw error;
  }
};
