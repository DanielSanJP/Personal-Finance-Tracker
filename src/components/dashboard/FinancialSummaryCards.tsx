"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getCurrentMonthName } from "@/lib/utils";
import type { DashboardData } from "@/lib/data/dashboard";

interface FinancialSummaryCardsProps {
  summary: DashboardData["summary"];
}

export default function FinancialSummaryCards({
  summary,
}: FinancialSummaryCardsProps) {
  const currentMonth = getCurrentMonthName();

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm">Account Balance</CardTitle>
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
  );
}
