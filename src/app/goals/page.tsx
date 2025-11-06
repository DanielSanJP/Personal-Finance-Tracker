"use client";

import GoalContent from "@/components/goals/GoalContent";
import { useGoals } from "@/hooks/queries";
import GoalsLoading from "./loading";
import { useAccountCheck } from "@/hooks/useAccountCheck";
import { AccountRequiredModal } from "@/components/account-required-modal";
import { useAuth } from "@/hooks/queries/useAuth";

export default function GoalsPage() {
  const { error, isLoading } = useGoals();
  const { isAuthenticated } = useAuth();
  const { hasAccounts, isLoading: accountsLoading } = useAccountCheck();

  if (isLoading || accountsLoading) {
    return <GoalsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AccountRequiredModal visible={isAuthenticated && !hasAccounts} />
        <GoalContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AccountRequiredModal visible={isAuthenticated && !hasAccounts} />
      <GoalContent />
    </div>
  );
}
