import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { UserPreferences } from "@/types";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

interface UpdatePreferencesInput {
  currency?: UserPreferences["currency"];
  language?: UserPreferences["language"];
  email_notifications?: boolean;
  budget_alerts?: boolean;
  goal_reminders?: boolean;
  weekly_reports?: boolean;
  show_account_numbers?: boolean;
  compact_view?: boolean;
  show_cents?: boolean;
}

export const usePreferencesMutations = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const updatePreferences = useMutation({
    mutationFn: async (input: UpdatePreferencesInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("user_preferences")
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate preferences query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.preferences.all });
      
      toast.success("Preferences saved successfully!", {
        description: "Your settings have been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to save preferences", {
        description: error.message,
      });
    },
  });

  return {
    updatePreferences,
  };
};
