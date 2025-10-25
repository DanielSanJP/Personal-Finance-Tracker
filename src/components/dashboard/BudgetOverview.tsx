"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useBudgets } from "@/hooks/queries";
import { Budget } from "@/types";
import Link from "next/link";

export default function BudgetOverview() {
  const { data: budgets = [], isLoading } = useBudgets();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">No budgets created yet</p>
          <Link href="/budgets/add">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Budget
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalBudget = budgets.reduce(
    (sum: number, budget: Budget) => sum + budget.budgetAmount,
    0
  );
  const totalSpent = budgets.reduce(
    (sum: number, budget: Budget) => sum + budget.spentAmount,
    0
  );
  const totalRemaining = budgets.reduce(
    (sum: number, budget: Budget) => sum + budget.remainingAmount,
    0
  );

  // Get top 3 budgets to display
  const topBudgets = budgets
    .slice()
    .sort((a: Budget, b: Budget) => b.budgetAmount - a.budgetAmount)
    .slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Budget Overview</CardTitle>
        <Link href="/budgets">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Budget Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-semibold">
              {formatCurrency(totalBudget)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Spent</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                totalRemaining >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>

        {/* Top Budgets */}
        <div className="space-y-2">
          {topBudgets.map((budget: Budget) => {
            const progressPercentage =
              budget.budgetAmount > 0
                ? Math.min(
                    (budget.spentAmount / budget.budgetAmount) * 100,
                    100
                  )
                : 0;
            const isOverBudget = budget.spentAmount > budget.budgetAmount;

            return (
              <div
                key={budget.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {budget.category}
                    </span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {isOverBudget ? (
                        <TrendingUp className="w-3 h-3 mr-1 text-red-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1 text-green-500" />
                      )}
                      {formatCurrency(budget.spentAmount)} /{" "}
                      {formatCurrency(budget.budgetAmount)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isOverBudget ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {budgets.length > 3 && (
          <div className="text-center mt-4">
            <Link href="/budgets">
              <Button variant="ghost" size="sm">
                View {budgets.length - 3} more budgets
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
