"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { Budget } from "@/types";

interface BudgetSummaryProps {
  budgets: Budget[];
}

export default function BudgetSummary({ budgets }: BudgetSummaryProps) {
  // Calculate totals
  const totalBudget = budgets.reduce(
    (sum: number, budget: Budget) => sum + budget.budgetAmount,
    0
  );
  const totalSpent = budgets.reduce(
    (sum: number, budget: Budget) => sum + budget.spentAmount,
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  if (budgets.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Budget Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
              Total Budget
            </div>
            <div className="bg-muted px-2 py-1 rounded-full min-w-[80px]">
              <div className="text-sm sm:text-base font-bold text-foreground text-center">
                {formatCurrency(totalBudget)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
              Total Spent
            </div>
            <div
              className={`px-2 py-1 rounded-full min-w-[80px] ${
                totalSpent > totalBudget
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-muted"
              }`}
            >
              <div
                className={`text-sm sm:text-base font-bold text-center ${
                  totalSpent > totalBudget
                    ? "text-red-800 dark:text-red-300"
                    : "text-foreground"
                }`}
              >
                {formatCurrency(totalSpent)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
              Remaining
            </div>
            <div
              className={`px-2 py-1 rounded-full min-w-[80px] ${
                totalRemaining < 0
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              <div
                className={`text-sm sm:text-base font-bold text-center ${
                  totalRemaining < 0 ? "text-red-800" : "text-green-800"
                }`}
              >
                {formatCurrency(totalRemaining)}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
            <span className="text-sm font-medium">Overall Budget Progress</span>
            <span className="text-sm text-muted-foreground">
              {totalBudget > 0
                ? ((totalSpent / totalBudget) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <Progress
            value={Math.min(
              totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
              100
            )}
            className={`h-3 ${
              totalSpent > totalBudget
                ? "bg-red-100 dark:bg-red-950 [&>div]:bg-red-500 dark:[&>div]:bg-red-600"
                : totalBudget > 0 && (totalSpent / totalBudget) * 100 > 80
                ? "bg-orange-100 dark:bg-orange-950 [&>div]:bg-orange-500 dark:[&>div]:bg-orange-600"
                : "bg-primary/20 [&>div]:bg-primary"
            }`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
