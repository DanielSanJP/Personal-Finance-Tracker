import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { UserPreferences } from "@/types";
import { queryKeys } from "@/lib/query-keys";

export const usePreferences = () => {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.preferences.all,
    queryFn: async (): Promise<UserPreferences | null> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // If no preferences exist yet, the trigger should have created them
        // but in case it didn't, return null
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
