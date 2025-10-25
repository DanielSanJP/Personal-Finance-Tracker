import { usePreferences, useAuth } from "@/hooks/queries";
import { UserPreferences } from "@/types";

/**
 * Custom hook that provides user preferences with fallbacks for unauthenticated users
 * For authenticated users: loads from database
 * For guest users: uses localStorage and sensible defaults
 * 
 * Note: Theme is managed locally via next-themes and not stored in database
 */
export const useUserPreferences = () => {
  const { data: dbPreferences, isLoading } = usePreferences();
  const { isAuthenticated } = useAuth();

  // Default preferences for guest users or when no data is available
  const defaultPreferences: Partial<UserPreferences> = {
    currency: "USD",
    language: "English",
    email_notifications: true,
    budget_alerts: true,
    goal_reminders: false,
    weekly_reports: true,
    show_account_numbers: false,
    compact_view: false,
    show_cents: true,
  };

  // For authenticated users, use database preferences
  // For guest users, use defaults (could be enhanced with localStorage)
  const preferences = isAuthenticated && dbPreferences
    ? dbPreferences
    : defaultPreferences;

  return {
    preferences: preferences as UserPreferences,
    isLoading: isAuthenticated ? isLoading : false,
  };
};
