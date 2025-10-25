import { useCallback } from "react";
import { useUserPreferences } from "./useUserPreferences";
import { formatCurrency as baseCurrency } from "@/lib/utils";

/**
 * Hook that provides a currency formatter configured with user preferences
 * @returns formatCurrency function that uses user's currency and showCents preferences
 */
export const useCurrency = () => {
  const { preferences } = useUserPreferences();

  const formatCurrency = useCallback(
    (amount: number) => {
      return baseCurrency(
        amount,
        preferences.currency || "USD",
        preferences.show_cents ?? true
      );
    },
    [preferences.currency, preferences.show_cents]
  );

  return {
    formatCurrency,
    currency: preferences.currency || "USD",
    showCents: preferences.show_cents ?? true,
  };
};
