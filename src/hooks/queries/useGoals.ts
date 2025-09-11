import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth";

// Goal functions moved from deleted data folder
export const getCurrentUserGoals = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }

    return (data || []).map(goal => ({
      id: goal.id,
      userId: goal.user_id,
      name: goal.name,
      targetAmount: Number(goal.target_amount),
      currentAmount: Number(goal.current_amount),
      targetDate: goal.target_date,
      category: goal.category,
      priority: goal.priority,
      status: goal.status,
      createdAt: goal.created_at,
      updatedAt: goal.updated_at
    }));
  } catch (error) {
    console.error('Error in getCurrentUserGoals:', error);
    return [];
  }
};

export const getCurrentUserAccounts = async () => {
  const user = await getCurrentUser();
  if (!user) return [];
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }

    return (data || []).map(account => ({
      id: account.id,
      userId: account.user_id,
      name: account.name,
      balance: Number(account.balance),
      type: account.type,
      accountNumber: account.account_number || '',
      isActive: account.is_active
    }));
  } catch (error) {
    console.error('Error in getCurrentUserAccounts:', error);
    return [];
  }
};

export const createGoal = async (goalData: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  priority?: string;
  status: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
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
        category: null,
        priority: goalData.priority || 'medium',
        status: goalData.status
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
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in createGoal:', error);
    throw error;
  }
};

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

  try {
    const supabase = createClient();
    
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
      .eq('user_id', user.id)
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
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error in updateGoal:', error);
    throw error;
  }
};

export const deleteGoal = async (goalId: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting goal:', error);
      throw new Error('Failed to delete goal');
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteGoal:', error);
    throw error;
  }
};

export const makeGoalContribution = async (contributionData: {
  goalId: string;
  accountId: string;
  amount: number;
  date: Date;
  notes?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const supabase = createClient();
    
    // Get current goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('current_amount')
      .eq('id', contributionData.goalId)
      .eq('user_id', user.id)
      .single();

    if (goalError || !goal) {
      throw new Error('Goal not found');
    }

    // Update goal with new contribution amount
    const newCurrentAmount = Number(goal.current_amount) + contributionData.amount;
    
    const { error: updateError } = await supabase
      .from('goals')
      .update({ current_amount: newCurrentAmount })
      .eq('id', contributionData.goalId)
      .eq('user_id', user.id);

    if (updateError) {
      throw new Error('Failed to update goal contribution');
    }

    return { success: true, newCurrentAmount };
  } catch (error) {
    console.error('Error in makeGoalContribution:', error);
    throw error;
  }
};

const GOAL_QUERY_KEYS = {
  goals: ["goals"],
  accounts: ["accounts"],
};

// Goals Query
export function useGoals() {
  return useQuery({
    queryKey: GOAL_QUERY_KEYS.goals,
    queryFn: async () => {
      const data = await getCurrentUserGoals();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Accounts Query for Goals (to avoid naming conflict)
export function useAccountsForGoals() {
  return useQuery({
    queryKey: GOAL_QUERY_KEYS.accounts,
    queryFn: async () => {
      const data = await getCurrentUserAccounts();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create Goal Mutation
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalData: {
      name: string;
      targetAmount: number;
      currentAmount?: number;
      targetDate?: string;
      priority?: string;
      status: string;
    }) => {
      const isGuest = await checkGuestAndWarn("create goals");
      if (isGuest) {
        throw new Error("Guest users cannot create goals");
      }
      return createGoal(goalData);
    },
    onSuccess: () => {
      toast.success("Goal created successfully!");
      queryClient.invalidateQueries({
        queryKey: GOAL_QUERY_KEYS.goals,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot create goals") {
        console.error("Error creating goal:", error);
        toast.error("Failed to create goal");
      }
    },
  });
}

// Update Goal Mutation
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      goalData,
    }: {
      goalId: string;
      goalData: {
        name?: string;
        targetAmount?: number;
        currentAmount?: number;
        targetDate?: string | null;
        category?: string | null;
        priority?: string | null;
        status?: string;
      };
    }) => {
      const isGuest = await checkGuestAndWarn("edit goals");
      if (isGuest) {
        throw new Error("Guest users cannot update goals");
      }
      
      // Convert null values to undefined for the API
      const apiData = {
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        currentAmount: goalData.currentAmount,
        targetDate: goalData.targetDate || undefined,
        category: goalData.category || undefined,
        priority: goalData.priority || undefined,
        status: goalData.status,
      };

      return updateGoal(goalId, apiData);
    },
    onSuccess: () => {
      toast.success("Goal updated successfully!");
      queryClient.invalidateQueries({
        queryKey: GOAL_QUERY_KEYS.goals,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot update goals") {
        console.error("Error updating goal:", error);
        toast.error("Failed to update goal");
      }
    },
  });
}

// Delete Goal Mutation
export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: string) => {
      const isGuest = await checkGuestAndWarn("delete goals");
      if (isGuest) {
        throw new Error("Guest users cannot delete goals");
      }
      return deleteGoal(goalId);
    },
    onSuccess: () => {
      toast.success("Goal deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: GOAL_QUERY_KEYS.goals,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot delete goals") {
        console.error("Error deleting goal:", error);
        toast.error("Failed to delete goal");
      }
    },
  });
}

// Make Goal Contribution Mutation
export function useMakeGoalContribution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contributionData: {
      goalId: string;
      accountId: string;
      amount: number;
      date: Date;
      notes?: string;
    }) => {
      const isGuest = await checkGuestAndWarn("make goal contributions");
      if (isGuest) {
        throw new Error("Guest users cannot make goal contributions");
      }
      return makeGoalContribution(contributionData);
    },
    onSuccess: () => {
      toast.success("Contribution made successfully!");
      queryClient.invalidateQueries({
        queryKey: GOAL_QUERY_KEYS.goals,
      });
      queryClient.invalidateQueries({
        queryKey: GOAL_QUERY_KEYS.accounts,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot make goal contributions") {
        console.error("Error making contribution:", error);
        toast.error("Failed to make contribution");
      }
    },
  });
}
