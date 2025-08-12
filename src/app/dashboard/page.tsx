"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Nav from "@/components/nav";
import { SpendingChart } from "@/components/spending-chart";
import { EmptyAccounts } from "@/components/empty-states";
import { DashboardSkeleton } from "@/components/loading-states";
import { toast } from "sonner";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getCurrentUserAccounts,
  calculateCurrentUserSummary,
  formatCurrency,
  getCurrentMonthName,
} from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";

interface Summary {
  totalBalance: number;
  monthlyChange: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetRemaining: number;
  accountBreakdown: Record<string, unknown>;
  categorySpending: Record<string, unknown>;
}

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [calculatedTotalBalance, setCalculatedTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const currentMonth = getCurrentMonthName();

  useEffect(() => {
    // Don't load data until auth is ready
    if (authLoading || !user) return;

    const loadData = async () => {
      try {
        const [accountsData, summaryData] = await Promise.all([
          getCurrentUserAccounts(),
          calculateCurrentUserSummary(),
        ]);

        setAccounts(accountsData);
        setSummary(summaryData);

        // Calculate total balance from accounts
        const totalBalance = accountsData.reduce(
          (total: number, account: Account) => total + account.balance,
          0
        );
        setCalculatedTotalBalance(totalBalance);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Redirect to login if no user (not guest mode)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Please sign in to view your dashboard
              </p>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="  text-center">Account Balance</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-lg sm:text-xl font-bold text-gray-900 text-center">
                {formatCurrency(calculatedTotalBalance)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                This Month ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div
                className={`text-lg sm:text-xl font-bold text-center ${
                  !summary || (summary.monthlyChange || 0) === 0
                    ? "text-gray-900"
                    : (summary.monthlyChange || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {summary && (summary.monthlyChange || 0) > 0 ? "+" : ""}
                {summary
                  ? formatCurrency(summary.monthlyChange || 0)
                  : formatCurrency(0)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                Income ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div
                className={`text-lg sm:text-xl font-bold text-center ${
                  !summary || (summary.monthlyIncome || 0) === 0
                    ? "text-gray-900"
                    : "text-green-600"
                }`}
              >
                {summary && (summary.monthlyIncome || 0) > 0 ? "+" : ""}
                {summary
                  ? formatCurrency(summary.monthlyIncome || 0)
                  : formatCurrency(0)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                Budget Remaining ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div
                className={`text-lg sm:text-xl font-bold text-center ${
                  !summary || (summary.budgetRemaining || 0) === 0
                    ? "text-gray-900"
                    : (summary.budgetRemaining || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {summary
                  ? formatCurrency(summary.budgetRemaining || 0)
                  : formatCurrency(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Spending Overview */}
          <SpendingChart />

          {/* Your Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Your Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <EmptyAccounts />
              ) : (
                <div className="space-y-4">
                  {accounts.map((account, index) => (
                    <div
                      key={account.id}
                      className={`flex justify-between items-center py-3 ${
                        index < accounts.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <span className="text-gray-700">{account.name}</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/income/add">
                  <Button variant="outline" className="p-6 cursor-pointer">
                    Add Income
                  </Button>
                </Link>
                <Link href="/transactions/add">
                  <Button variant="outline" className="p-6 cursor-pointer">
                    Add Expense
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    toast("Scan Receipt functionality not implemented yet", {
                      description:
                        "This feature will be available in a future update.",
                      action: {
                        label: "Dismiss",
                        onClick: () => console.log("Dismissed"),
                      },
                    })
                  }
                >
                  Scan Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
