"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpendingChart } from "@/components/spending-chart";
import { useDashboardData } from "@/hooks/queries";
import QuickActions from "./QuickActions";
import FinancialSummaryCards from "./FinancialSummaryCards";
import AccountsOverview from "./AccountsOverview";

export default function DashboardContent() {
  const { data: dashboardData, error, refetch } = useDashboardData();

  if (error || !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Failed to load dashboard data</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { accounts, transactions, summary } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Quick Actions */}
      <QuickActions />

      {/* Financial Summary Cards */}
      <FinancialSummaryCards summary={summary} />

      {/* Spending Overview */}
      <SpendingChart transactions={transactions} />

      {/* Your Accounts */}
      <AccountsOverview accounts={accounts} />
    </div>
  );
}
