"use client";

import Nav from "@/components/nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BudgetListSkeleton } from "@/components/loading-states";
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
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  getCurrentUserBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/lib/data";
import { EmptyBudgets } from "@/components/empty-states";
import { useState, useEffect } from "react";

interface Budget {
  id: string;
  userId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: string;
  startDate: string;
  endDate: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [editBudgetsOpen, setEditBudgetsOpen] = useState(false);

  // Form states for adding budgets
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgetAmount: "",
    period: "monthly",
  });

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserBudgets();
      setBudgets(data || []);
    } catch (error) {
      console.error("Error loading budgets:", error);
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // Handle creating a new budget
  const handleCreateBudget = async () => {
    try {
      if (!newBudget.category || !newBudget.budgetAmount) {
        toast.error("Please fill in the category and budget amount");
        return;
      }

      // Calculate date range based on period
      const now = new Date();
      let startDate: string;
      let endDate: string;

      if (newBudget.period === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];
      } else if (newBudget.period === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        startDate = startOfWeek.toISOString().split("T")[0];
        endDate = endOfWeek.toISOString().split("T")[0];
      } else {
        // yearly
        startDate = new Date(now.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(now.getFullYear(), 11, 31)
          .toISOString()
          .split("T")[0];
      }

      await createBudget({
        category: newBudget.category,
        budgetAmount: parseFloat(newBudget.budgetAmount),
        period: newBudget.period,
        startDate,
        endDate,
        spentAmount: 0,
      });

      // Reset form
      setNewBudget({
        category: "",
        budgetAmount: "",
        period: "monthly",
      });
      setAddBudgetOpen(false);

      // Reload budgets
      await loadBudgets();

      toast.success("Budget created successfully!");
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Failed to create budget");
    }
  };

  // Handle updating a budget
  const handleUpdateBudget = async (
    budgetId: string,
    budgetData: Partial<Budget>
  ) => {
    try {
      await updateBudget(budgetId, budgetData);

      // Reload budgets
      await loadBudgets();

      toast.success("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  };

  // Handle deleting a budget
  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);

      // Reload budgets
      await loadBudgets();

      toast.success("Budget deleted successfully!");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

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

  // Calculate total budget and remaining amounts
  const totalBudget = budgets.reduce(
    (sum, budget) => sum + budget.budgetAmount,
    0
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + budget.spentAmount,
    0
  );
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <BudgetListSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                Monthly Budget Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {budgets.length === 0 ? (
                <EmptyBudgets onRefresh={loadBudgets} />
              ) : (
                <>
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
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                            <span className="text-sm sm:text-base font-medium">
                              {budget.category}
                            </span>
                            <span className="text-sm sm:text-base text-gray-600">
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
                              {(
                                budget.spentAmount - budget.budgetAmount
                              ).toFixed(0)}
                            </div>
                          )}
                        </div>

                        {index < budgets.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })}

                  {/* Budget Summary */}
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
                          ${totalBudget.toFixed(0)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 font-medium">
                          Total Spent
                        </div>
                        <Badge
                          variant={
                            totalSpent > totalBudget
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-base sm:text-lg font-bold px-3 py-1"
                        >
                          ${totalSpent.toFixed(0)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 font-medium">
                          Remaining
                        </div>
                        <Badge
                          variant={
                            totalRemaining < 0 ? "destructive" : "default"
                          }
                          className="text-base sm:text-lg font-bold px-3 py-1"
                        >
                          ${totalRemaining.toFixed(0)}
                        </Badge>
                      </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-sm font-medium">
                          Overall Budget Progress
                        </span>
                        <span className="text-sm text-gray-600">
                          {((totalSpent / totalBudget) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            totalSpent > totalBudget
                              ? "bg-red-500"
                              : (totalSpent / totalBudget) * 100 > 80
                              ? "bg-orange-500"
                              : "bg-gray-900"
                          }`}
                          style={{
                            width: `${Math.min(
                              (totalSpent / totalBudget) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-4 flex flex-col items-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Dialog
                        open={addBudgetOpen}
                        onOpenChange={setAddBudgetOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="w-40">Add Budget</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Budget</DialogTitle>
                            <DialogDescription>
                              Create a new budget category with your desired
                              spending limit.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={newBudget.category}
                                onValueChange={(value) =>
                                  setNewBudget({
                                    ...newBudget,
                                    category: value,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
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
                                value={newBudget.budgetAmount}
                                onChange={(e) =>
                                  setNewBudget({
                                    ...newBudget,
                                    budgetAmount: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="period">Budget Period</Label>
                              <Select
                                value={newBudget.period}
                                onValueChange={(value) =>
                                  setNewBudget({ ...newBudget, period: value })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monthly">
                                    Monthly
                                  </SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleCreateBudget}>
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
                          <Button variant="outline" className="w-40">
                            Edit Budgets
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>Edit Budget Categories</DialogTitle>
                            <DialogDescription>
                              Modify your existing budget amounts and
                              categories.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                            {budgets.map((budget) => {
                              const handleSaveBudget = () => {
                                const budgetInput = document.getElementById(
                                  `budget-${budget.id}`
                                ) as HTMLInputElement;

                                if (budgetInput) {
                                  handleUpdateBudget(budget.id, {
                                    budgetAmount:
                                      parseFloat(budgetInput.value) || 0,
                                  });
                                }
                              };

                              const handleDeleteBudgetClick = () => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete the "${budget.category}" budget?`
                                  )
                                ) {
                                  handleDeleteBudget(budget.id);
                                }
                              };

                              return (
                                <div
                                  key={budget.id}
                                  className="grid gap-3 p-4 border rounded-lg"
                                >
                                  <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">
                                      {budget.category}
                                    </Label>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={handleSaveBudget}
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleDeleteBudgetClick}
                                      >
                                        Delete
                                      </Button>
                                    </div>
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
                                    Current spending: $
                                    {budget.spentAmount.toFixed(0)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="w-40"
                        onClick={() =>
                          toast(
                            "View Reports functionality not implemented yet",
                            {
                              description:
                                "This feature will be available in a future update.",
                              action: {
                                label: "Dismiss",
                                onClick: () => console.log("Dismissed"),
                              },
                            }
                          )
                        }
                      >
                        View Reports
                      </Button>
                      <Button
                        variant="outline"
                        className="w-40"
                        onClick={() =>
                          toast(
                            "Export Data functionality not implemented yet",
                            {
                              description:
                                "This feature will be available in a future update.",
                              action: {
                                label: "Dismiss",
                                onClick: () => console.log("Dismissed"),
                              },
                            }
                          )
                        }
                      >
                        Export Data
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
