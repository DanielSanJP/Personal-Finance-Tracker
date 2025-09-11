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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { accounts, transactions, summary } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      {/* Quick Actions */}
      <QuickActions />

      {/* Financial Summary Cards */}
      <FinancialSummaryCards summary={summary} />

      <div className="space-y-4">
        {/* Spending Overview */}
        <SpendingChart transactions={transactions} />

        {/* Your Accounts */}
        <AccountsOverview accounts={accounts} />
      </div>
    </div>
  );
}
