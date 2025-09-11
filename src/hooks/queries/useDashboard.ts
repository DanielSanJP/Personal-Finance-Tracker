import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDashboardData } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const DASHBOARD_QUERY_KEYS = {
  dashboardData: ["dashboard", "data"] as const,
} as const;

export function useDashboardData() {
  const queryClient = useQueryClient();

  // Handle auth state changes for cache clearing
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      // Clear React Query cache when user changes or signs out
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        // Invalidate dashboard queries
        queryClient.invalidateQueries({
          queryKey: DASHBOARD_QUERY_KEYS.dashboardData,
        });

        // If signed out, clear the query cache
        if (event === "SIGNED_OUT") {
          queryClient.setQueryData(DASHBOARD_QUERY_KEYS.dashboardData, null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.dashboardData,
    queryFn: async () => {
      try {
        return await getDashboardData();
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
