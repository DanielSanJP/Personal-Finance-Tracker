"use client";

import Nav from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Pencil } from "lucide-react";
import budgetsData from "@/data/budgets.json";
import { useState } from "react";

export default function BudgetsPage() {
  const { budgets } = budgetsData;
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [editBudgetsOpen, setEditBudgetsOpen] = useState(false);

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Health & Fitness",
    "Travel",
    "Education",
    "Personal Care",
    "Other",
  ];

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100)
      return {
        status: "over",
        variant: "destructive" as const,
        color: "destructive",
      };
    if (percentage >= 100)
      return {
        status: "full",
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

  const getProgressWidth = (spent: number, budget: number) => {
    if (spent === 0) return 0;
    const percentage = Math.min((spent / budget) * 100, 100);
    return percentage;
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
              const progressWidth = getProgressWidth(
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
                        ${budget.spentAmount.toFixed(2)} / $
                        {budget.budgetAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          budgetStatus.status === "over" ||
                          budgetStatus.status === "full"
                            ? "bg-red-500"
                            : budgetStatus.status === "warning"
                            ? "bg-orange-500"
                            : "bg-gray-900"
                        }`}
                        style={{ width: `${progressWidth}%` }}
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
                <Dialog open={addBudgetOpen} onOpenChange={setAddBudgetOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold cursor-pointer">
                      Add Budget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Budget</DialogTitle>
                      <DialogDescription>
                        Create a new budget category with your desired spending
                        limit.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Budget Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter budget amount"
                          className="w-full"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="period">Budget Period</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Create Budget
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={editBudgetsOpen}
                  onOpenChange={setEditBudgetsOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 py-3 text-base font-semibold border-gray-300 bg-white text-black hover:bg-gray-50 cursor-pointer"
                    >
                      Edit Budgets
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Edit Budget Categories</DialogTitle>
                      <DialogDescription>
                        Modify your existing budget amounts and categories.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                      {budgets.map((budget) => (
                        <div
                          key={budget.id}
                          className="grid gap-3 p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">
                              {budget.category}
                            </Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor={`budget-${budget.id}`}>
                              Budget Amount
                            </Label>
                            <Input
                              id={`budget-${budget.id}`}
                              type="number"
                              defaultValue={budget.budgetAmount}
                              className="w-full"
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            Current spending: ${budget.spentAmount.toFixed(0)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditBudgetsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
