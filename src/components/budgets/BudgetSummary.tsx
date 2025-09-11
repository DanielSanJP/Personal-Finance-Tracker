"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
    <>
      <Separator className="mt-6" />
      <div className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-sm text-gray-600 font-medium">
              Total Budget
            </div>
            <Badge
              variant="outline"
              className="text-base sm:text-lg font-bold px-3 py-1"
            >
              {formatCurrency(totalBudget)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 font-medium">Total Spent</div>
            <Badge
              variant={totalSpent > totalBudget ? "destructive" : "secondary"}
              className="text-base sm:text-lg font-bold px-3 py-1"
            >
              {formatCurrency(totalSpent)}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600 font-medium">Remaining</div>
            <Badge
              variant={totalRemaining < 0 ? "destructive" : "default"}
              className="text-base sm:text-lg font-bold px-3 py-1"
            >
              {formatCurrency(totalRemaining)}
            </Badge>
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
      </div>
    </>
  );
}
