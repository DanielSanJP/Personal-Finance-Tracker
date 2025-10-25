"use client";

import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Budget } from "@/types";

interface BudgetListProps {
  budgets: Budget[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  // Helper functions
  const isOverBudget = (spent: number, budget: number) => spent > budget;

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { status: "over", color: "bg-red-500" };
    if (percentage >= 80) return { status: "warning", color: "bg-orange-500" };
    return { status: "good", color: "bg-foreground" };
  };

  const getProgressWidth = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  // Show over budget alert
  const hasOverBudgetItems = budgets.some((budget) =>
    isOverBudget(budget.spentAmount, budget.budgetAmount)
  );

  return (
    <div className="space-y-4">
      {/* Over Budget Alert */}
      {hasOverBudgetItems && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have categories that are over budget this month.
          </AlertDescription>
        </Alert>
      )}

      {/* Budget Items */}
      {budgets.map((budget, index) => {
        const budgetStatus = getBudgetStatus(
          budget.spentAmount,
          budget.budgetAmount
        );
        const overBudget = isOverBudget(
          budget.spentAmount,
          budget.budgetAmount
        );
        const progressWidth = getProgressWidth(
          budget.spentAmount,
          budget.budgetAmount
        );

        return (
          <div key={budget.id} data-budget-id={budget.id}>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                <span className="text-sm sm:text-base font-medium">
                  {budget.category}
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">
                  {formatCurrency(budget.spentAmount)} /{" "}
                  {formatCurrency(budget.budgetAmount)}
                </span>
              </div>

              <Progress
                value={progressWidth}
                className={`h-2 ${
                  budgetStatus.status === "over" ||
                  budgetStatus.status === "full"
                    ? "bg-red-100 dark:bg-red-950 [&>div]:bg-red-500 dark:[&>div]:bg-red-600"
                    : budgetStatus.status === "warning"
                    ? "bg-orange-100 dark:bg-orange-950 [&>div]:bg-orange-500 dark:[&>div]:bg-orange-600"
                    : "bg-primary/20 [&>div]:bg-primary"
                }`}
              />

              {overBudget && (
                <div className="text-sm text-red-600 font-medium">
                  Over budget by{" "}
                  {formatCurrency(budget.spentAmount - budget.budgetAmount)}
                </div>
              )}
            </div>

            {index < budgets.length - 1 && <Separator className="mt-4" />}
          </div>
        );
      })}
    </div>
  );
}

export default BudgetList;
