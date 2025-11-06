"use client";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/queries";
import DashboardLoading from "./loading";
import { useAccountCheck } from "@/hooks/useAccountCheck";
import { AccountRequiredModal } from "@/components/account-required-modal";
import { useAuth } from "@/hooks/queries/useAuth";

export default function Dashboard() {
  const { data: dashboardData, error, isLoading } = useDashboardData();
  const { isAuthenticated } = useAuth();
  const { hasAccounts, isLoading: accountsLoading } = useAccountCheck();

  if (isLoading || accountsLoading) {
    return <DashboardLoading />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background">
        <AccountRequiredModal visible={isAuthenticated && !hasAccounts} />
        <DashboardContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AccountRequiredModal visible={isAuthenticated && !hasAccounts} />
      <DashboardContent />
    </div>
  );
}
