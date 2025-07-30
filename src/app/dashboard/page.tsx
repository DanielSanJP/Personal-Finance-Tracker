"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Nav from "@/components/nav";
import { SpendingChart } from "@/components/spending-chart";
import { toast } from "sonner";
import Link from "next/link";
import {
  getCurrentUserAccounts,
  getCurrentUserSummary,
  formatCurrency,
} from "@/lib/data";

export default function Dashboard() {
  const accounts = getCurrentUserAccounts();
  const summary = getCurrentUserSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="  text-center">Total Balance</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-lg sm:text-xl font-bold text-gray-900 text-center">
                {formatCurrency(summary.totalBalance)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className=" text-center">This Month</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-lg sm:text-xl font-bold text-red-600 text-center">
                {formatCurrency(summary.monthlyChange)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                Income
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-lg sm:text-xl font-bold text-green-600 text-center">
                +{formatCurrency(summary.monthlyIncome)}
              </div>
            </CardContent>
          </Card>

          <Card className=" flex flex-col justify-center gap-2">
            <CardHeader className="pb-1 px-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 text-center">
                Budget Remaining
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="text-lg sm:text-xl font-bold text-gray-900 text-center">
                {formatCurrency(summary.budgetRemaining)}
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
