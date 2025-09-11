import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUserBudgetsWithRealTimeSpending,
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/lib/data";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";

export const BUDGET_QUERY_KEYS = {
  budgets: ["budgets"] as const,
  userBudgets: (userId?: string) => ["budgets", "user", userId] as const,
} as const;

export function useBudgets() {
  return useQuery({
    queryKey: BUDGET_QUERY_KEYS.budgets,
    queryFn: getCurrentUserBudgetsWithRealTimeSpending,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetData: {
      category: string;
      budgetAmount: number;
      period: string;
      startDate: string;
      endDate: string;
    }) => {
      const isGuest = await checkGuestAndWarn("create budget");
      if (isGuest) {
        throw new Error("Guest users cannot create budgets");
      }
      return createBudget(budgetData);
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Budget created successfully!");
        queryClient.invalidateQueries({
          queryKey: BUDGET_QUERY_KEYS.budgets,
        });
      } else {
        // Handle specific budget exists error
        if (result.errorType === "BUDGET_EXISTS") {
          toast.error(result.error || "Budget already exists", {
            duration: 5000,
          });
        } else {
          toast.error(result.error || "Failed to create budget");
        }
        throw new Error(result.error || "Failed to create budget");
      }
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot create budgets") {
        console.error("Error creating budget:", error);
        toast.error("An unexpected error occurred");
      }
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      budgetData,
    }: {
      id: string;
      budgetData: { budgetAmount: number };
    }) => {
      const isGuest = await checkGuestAndWarn("update budget");
      if (isGuest) {
        throw new Error("Guest users cannot update budgets");
      }
      return updateBudget(id, budgetData);
    },
    onSuccess: () => {
      toast.success("Budget updated successfully!");
      queryClient.invalidateQueries({
        queryKey: BUDGET_QUERY_KEYS.budgets,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot update budgets") {
        console.error("Error updating budget:", error);
        toast.error("Failed to update budget");
      }
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (budgetId: string) => {
      const isGuest = await checkGuestAndWarn("delete budget");
      if (isGuest) {
        throw new Error("Guest users cannot delete budgets");
      }
      return deleteBudget(budgetId);
    },
    onSuccess: () => {
      toast.success("Budget deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: BUDGET_QUERY_KEYS.budgets,
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Guest users cannot delete budgets") {
        console.error("Error deleting budget:", error);
        toast.error("Failed to delete budget");
      }
    },
  });
}
