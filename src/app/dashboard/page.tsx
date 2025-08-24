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
  getDashboardData,
  formatCurrency,
  getCurrentMonthName,
} from "@/lib/data";
import { clearUserCache } from "@/lib/data/auth";
import { dataCache } from "@/lib/data/cache";
import { createClient } from "@/lib/supabase/client";
import type { DashboardData } from "@/lib/data";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const currentMonth = getCurrentMonthName();

  // Handle auth state changes for cache clearing
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      // Clear cache when user changes or signs out
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        dataCache.clearAll();
        clearUserCache();

        // If signed out, don't try to load data
        if (event === "SIGNED_OUT") {
          setDashboardData(null);
          setLoading(false);
          return;
        }

        // If signed in, reload data after a brief delay to ensure auth state is settled
        setTimeout(() => {
          setLoading(true);
          loadData();
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Failed to load dashboard data
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { accounts, transactions, summary } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-sm">
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-lg font-bold">
                {formatCurrency(summary.totalBalance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-sm text-muted-foreground">
                This Month ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-center text-lg font-bold ${
                  (summary.monthlyChange || 0) === 0
                    ? ""
                    : (summary.monthlyChange || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(summary.monthlyChange || 0) > 0 ? "+" : ""}
                {formatCurrency(summary.monthlyChange || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-sm text-muted-foreground">
                Income ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-center text-lg font-bold ${
                  (summary.monthlyIncome || 0) === 0 ? "" : "text-green-600"
                }`}
              >
                {(summary.monthlyIncome || 0) > 0 ? "+" : ""}
                {formatCurrency(summary.monthlyIncome || 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-sm text-muted-foreground">
                Budget Remaining ({currentMonth})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-center text-lg font-bold ${
                  (summary.budgetRemaining || 0) === 0
                    ? ""
                    : (summary.budgetRemaining || 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(summary.budgetRemaining || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Spending Overview */}
          <SpendingChart transactions={transactions} />

          {/* Your Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <EmptyAccounts />
              ) : (
                <div className="space-y-2">
                  {accounts.map((account, index) => (
                    <div
                      key={account.id}
                      className={`flex justify-between items-center py-2 ${
                        index < accounts.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <span className="text-muted-foreground">
                        {account.name}
                      </span>
                      <span className="font-semibold">
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
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 flex flex-col items-center">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/income/add">
                    <Button className="w-32">Add Income</Button>
                  </Link>
                  <Link href="/transactions/add">
                    <Button className="w-32">Add Expense</Button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="w-32"
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
                  <Link href="/reports">
                    <Button variant="outline" className="w-32">
                      View Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
