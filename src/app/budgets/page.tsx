"use client";

import Nav from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import budgetsData from "@/data/budgets.json";

export default function BudgetsPage() {
  const { budgets } = budgetsData;

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100)
      return {
        status: "over",
        variant: "destructive" as const,
        color: "destructive",
      };
    if (percentage > 80)
      return {
        status: "warning",
        variant: "secondary" as const,
        color: "warning",
      };
    return { status: "good", variant: "default" as const, color: "default" };
  };

  const isOverBudget = (spent: number, budget: number) => {
    return spent > budget;
  };

  const getProgressWidthClass = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return "w-full";
    if (percentage >= 90) return "w-11/12";
    if (percentage >= 80) return "w-4/5";
    if (percentage >= 75) return "w-3/4";
    if (percentage >= 60) return "w-3/5";
    if (percentage >= 50) return "w-1/2";
    if (percentage >= 40) return "w-2/5";
    if (percentage >= 33) return "w-1/3";
    if (percentage >= 25) return "w-1/4";
    if (percentage >= 20) return "w-1/5";
    if (percentage >= 10) return "w-1/12";
    return "w-1/12"; // Minimum visible width
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Monthly Budget Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Over Budget Alert */}
            {budgets.some((budget) =>
              isOverBudget(budget.spentAmount, budget.budgetAmount)
            ) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have categories that are over budget this month.
                </AlertDescription>
              </Alert>
            )}

            {budgets.map((budget, index) => {
              const budgetStatus = getBudgetStatus(
                budget.spentAmount,
                budget.budgetAmount
              );
              const overBudget = isOverBudget(
                budget.spentAmount,
                budget.budgetAmount
              );
              const progressWidth = getProgressWidthClass(
                budget.spentAmount,
                budget.budgetAmount
              );

              return (
                <div key={budget.id}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">
                        {budget.category}
                      </span>
                      <span className="text-base text-gray-600">
                        ${budget.spentAmount.toFixed(0)} / $
                        {budget.budgetAmount.toFixed(0)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${progressWidth} ${
                          budgetStatus.status === "over"
                            ? "bg-red-500"
                            : budgetStatus.status === "warning"
                            ? "bg-orange-500"
                            : "bg-gray-900"
                        }`}
                      />
                    </div>

                    {overBudget && (
                      <div className="text-sm text-red-600 font-medium">
                        Over budget by $
                        {(budget.spentAmount - budget.budgetAmount).toFixed(0)}
                      </div>
                    )}
                  </div>

                  {index < budgets.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold cursor-pointer">
                  Add Budget
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 bg-white text-black hover:bg-gray-50 cursor-pointer"
                >
                  Edit Budgets
                </Button>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 cursor-pointer"
                >
                  View Reports
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 cursor-pointer"
                >
                  Export Data
                </Button>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base font-semibold border-gray-300 cursor-pointer"
                >
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
