import goalsData from '@/data/goals.json';
import { createClient } from '../supabase/client';
import { getCurrentUser, isGuestMode } from './auth';

// Goal functions
export const getCurrentUserGoals = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  if (isGuestMode()) {
    return goalsData.goals.filter(goal => goal.userId === user.id);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    // Map database fields to our interface
    return (data || []).map(goal => ({
      id: goal.id,
      userId: goal.user_id,
      name: goal.name,
      targetAmount: Number(goal.target_amount),
      currentAmount: Number(goal.current_amount),
      targetDate: goal.target_date,
      category: goal.category,
      priority: goal.priority,
      status: goal.status
    }));
  } catch (error) {
    console.error('Error in getCurrentUserGoals:', error);
    return [];
  }
};

export const getGoalsByUserId = async (userId: string) => {
  if (isGuestMode()) {
    return goalsData.goals.filter(goal => goal.userId === userId);
  }
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching goals by user ID:', error);
      return [];
    }

    // Map database fields to our interface
    return (data || []).map(goal => ({
      id: goal.id,
      userId: goal.user_id,
      name: goal.name,
      targetAmount: Number(goal.target_amount),
      currentAmount: Number(goal.current_amount),
      targetDate: goal.target_date,
      category: goal.category,
      priority: goal.priority,
      status: goal.status
    }));
  } catch (error) {
    console.error('Error in getGoalsByUserId:', error);
    return [];
  }
};

// Create a new goal
export const createGoal = async (goalData: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  category?: string;
  priority?: string;
  status?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    // In guest mode, we can't actually create goals in the database
    throw new Error('Cannot create goals in guest mode');
  }

  try {
    const supabase = createClient();
    
    // Generate a unique ID for the goal
    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('goals')
      .insert({
        id: goalId,
        user_id: user.id,
        name: goalData.name,
        target_amount: goalData.targetAmount,
        current_amount: goalData.currentAmount || 0,
        target_date: goalData.targetDate || null,
        category: goalData.category || null,
        priority: goalData.priority || 'medium',
        status: goalData.status || 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      throw new Error('Failed to create goal');
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      targetDate: data.target_date,
      category: data.category,
      priority: data.priority,
      status: data.status
    };
  } catch (error) {
    console.error('Error in createGoal:', error);
    throw error;
  }
};

// Update an existing goal
export const updateGoal = async (goalId: string, goalData: {
  name?: string;
  targetAmount?: number;
  currentAmount?: number;
  targetDate?: string;
  category?: string;
  priority?: string;
  status?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    throw new Error('Cannot update goals in guest mode');
  }

  try {
    const supabase = createClient();
    
    // Prepare update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (goalData.name !== undefined) updateData.name = goalData.name;
    if (goalData.targetAmount !== undefined) updateData.target_amount = goalData.targetAmount;
    if (goalData.currentAmount !== undefined) updateData.current_amount = goalData.currentAmount;
    if (goalData.targetDate !== undefined) updateData.target_date = goalData.targetDate;
    if (goalData.category !== undefined) updateData.category = goalData.category;
    if (goalData.priority !== undefined) updateData.priority = goalData.priority;
    if (goalData.status !== undefined) updateData.status = goalData.status;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalId)
      .eq('user_id', user.id) // Ensure user can only update their own goals
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      throw new Error('Failed to update goal');
    }

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      targetDate: data.target_date,
      category: data.category,
      priority: data.priority,
      status: data.status
    };
  } catch (error) {
    console.error('Error in updateGoal:', error);
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (goalId: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  if (isGuestMode()) {
    throw new Error('Cannot delete goals in guest mode');
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.id); // Ensure user can only delete their own goals

    if (error) {
      console.error('Error deleting goal:', error);
      throw new Error('Failed to delete goal');
    }

    return true;
  } catch (error) {
    console.error('Error in deleteGoal:', error);
    throw error;
  }
};
