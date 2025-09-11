import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import {
  getCurrentUserGoals,
  getCurrentUserAccounts,
  createGoal,
  updateGoal,
  deleteGoal,
  makeGoalContribution,
} from "@/lib/data";

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
