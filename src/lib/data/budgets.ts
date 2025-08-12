import { createClient } from '../supabase/client';
import { getCurrentUser } from './auth';
import { getCurrentUserTransactions } from './transactions';

// Calculate spent amount for a budget based on transactions
export const calculateBudgetSpentAmount = async (budget: {
  category: string;
  startDate: string;
  endDate: string;
}): Promise<number> => {
  try {
    const transactions = await getCurrentUserTransactions();
    
    // Filter transactions by category and date range
    const relevantTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(budget.startDate);
      const endDate = new Date(budget.endDate);
      
      return (
        transaction.category === budget.category &&
        transaction.type === 'expense' &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
    
    // Sum up the amounts (take absolute value for expenses)
    return relevantTransactions.reduce((total, transaction) => {
      return total + Math.abs(transaction.amount);
    }, 0);
  } catch (error) {
    console.error('Error calculating budget spent amount:', error);
    return 0;
  }
};

// Enhanced function to get budgets with real-time spent amounts
export const getCurrentUserBudgetsWithRealTimeSpending = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
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

    // Calculate real-time spent amounts for each budget
    const budgetsWithRealTimeSpending = await Promise.all(
      (data || []).map(async (budget) => {
        const realTimeSpentAmount = await calculateBudgetSpentAmount({
          category: budget.category,
          startDate: budget.start_date,
          endDate: budget.end_date,
        });

        return {
          id: budget.id,
          userId: budget.user_id,
          category: budget.category,
          budgetAmount: Number(budget.budget_amount),
          spentAmount: realTimeSpentAmount, // Use real-time calculated amount
          remainingAmount: Number(budget.budget_amount) - realTimeSpentAmount,
          period: budget.period,
          startDate: budget.start_date,
          endDate: budget.end_date,
          createdAt: budget.created_at,
          updatedAt: budget.updated_at
        };
      })
    );

    return budgetsWithRealTimeSpending;
  } catch (error) {
    console.error('Error in getCurrentUserBudgetsWithRealTimeSpending:', error);
    return [];
  }
};

// Budget functions
export const getCurrentUserBudgets = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
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
  
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Helper function to format date without timezone issues
    const formatDate = (date: Date): string => {
      return date.getFullYear() + '-' + 
             String(date.getMonth() + 1).padStart(2, '0') + '-' + 
             String(date.getDate()).padStart(2, '0');
    };
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .eq('period', 'monthly')
      .gte('start_date', formatDate(firstDayOfMonth))
      .lte('end_date', formatDate(lastDayOfMonth));

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
  
  try {
    // Get all current user budgets with real-time spending calculations
    const budgets = await getCurrentUserBudgetsWithRealTimeSpending();
    
    if (budgets.length === 0) return 0;
    
    // Calculate total budget amount and total remaining from all budgets
    const totalRemaining = budgets.reduce((total, budget) => {
      return total + (budget.budgetAmount - budget.spentAmount);
    }, 0);

    return Math.max(0, totalRemaining);
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
