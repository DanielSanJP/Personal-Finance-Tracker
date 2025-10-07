"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            <div className="text-xs sm:text-sm text-gray-600 font-medium text-center">
              Total Budget
            </div>
            <div className="bg-gray-100 px-2 py-1 rounded-full min-w-[80px]">
              <div className="text-sm sm:text-base font-bold text-gray-900 text-center">
                {formatCurrency(totalBudget)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs sm:text-sm text-gray-600 font-medium text-center">
              Total Spent
            </div>
            <div
              className={`px-2 py-1 rounded-full min-w-[80px] ${
                totalSpent > totalBudget ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <div
                className={`text-sm sm:text-base font-bold text-center ${
                  totalSpent > totalBudget ? "text-red-800" : "text-gray-900"
                }`}
              >
                {formatCurrency(totalSpent)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs sm:text-sm text-gray-600 font-medium text-center">
              Remaining
            </div>
            <div
              className={`px-2 py-1 rounded-full min-w-[80px] ${
                totalRemaining < 0 ? "bg-red-100" : "bg-green-100"
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
            <span className="text-sm text-gray-600">
              {totalBudget > 0
                ? ((totalSpent / totalBudget) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${
                totalSpent > totalBudget
                  ? "bg-red-500"
                  : totalBudget > 0 && (totalSpent / totalBudget) * 100 > 80
                  ? "bg-orange-500"
                  : "bg-gray-900"
              }`}
              style={{
                width: `${Math.min(
                  totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
