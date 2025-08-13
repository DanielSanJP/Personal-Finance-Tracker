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
  getCurrentUserBudgetsWithRealTimeSpending,
  createBudget,
  updateBudget,
  deleteBudget,
  formatCurrency,
} from "@/lib/data";
import { checkGuestAndWarn } from "@/lib/guest-protection";
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
  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateForSupabase = (date: Date): string => {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [editBudgetsOpen, setEditBudgetsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  // Form states for adding budgets
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgetAmount: "",
    period: "monthly",
  });

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserBudgetsWithRealTimeSpending();
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
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("create budgets");
    if (isGuest) return;

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
        // Start date: First day of current month
        const startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = formatDateForSupabase(startDateObj);

        // End date: Last day of current month
        const endDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate = formatDateForSupabase(endDateObj);
      } else if (newBudget.period === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        startDate = formatDateForSupabase(startOfWeek);
        endDate = formatDateForSupabase(endOfWeek);
      } else {
        // yearly
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31);
        startDate = formatDateForSupabase(yearStart);
        endDate = formatDateForSupabase(yearEnd);
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
    budgetData: Partial<Budget>,
    closeModal: boolean = false
  ) => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("edit budgets");
    if (isGuest) return;

    try {
      await updateBudget(budgetId, budgetData);

      // Reload budgets
      await loadBudgets();

      if (closeModal) {
        setEditBudgetsOpen(false);
      }

      toast.success("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget");
    }
  };

  // Handle deleting a budget
  const handleDeleteBudget = async (budgetId: string) => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("delete budgets");
    if (isGuest) return;

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

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      await handleDeleteBudget(budgetToDelete.id);
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
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
                              {formatCurrency(budget.spentAmount)} /{" "}
                              {formatCurrency(budget.budgetAmount)}
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
                              Over budget by{" "}
                              {formatCurrency(
                                budget.spentAmount - budget.budgetAmount
                              )}
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
                          {formatCurrency(totalBudget)}
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
                          {formatCurrency(totalSpent)}
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
                          {formatCurrency(totalRemaining)}
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
                            <Button
                              variant="outline"
                              onClick={() => {
                                setAddBudgetOpen(false);
                                // Reset form
                                setNewBudget({
                                  category: "",
                                  budgetAmount: "",
                                  period: "monthly",
                                });
                              }}
                            >
                              Cancel
                            </Button>
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
                                  handleUpdateBudget(
                                    budget.id,
                                    {
                                      budgetAmount:
                                        parseFloat(budgetInput.value) || 0,
                                    },
                                    true
                                  ); // Close modal after individual save
                                }
                              };

                              const handleDeleteBudgetClick = () => {
                                setBudgetToDelete(budget);
                                setDeleteConfirmOpen(true);
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
                                    Current spending:{" "}
                                    {formatCurrency(budget.spentAmount)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditBudgetsOpen(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              onClick={async () => {
                                // Save all budgets at once without individual reloads
                                try {
                                  // Close modal immediately to prevent flickering
                                  setEditBudgetsOpen(false);

                                  const savePromises = budgets.map(
                                    async (budget) => {
                                      const budgetInput =
                                        document.getElementById(
                                          `budget-${budget.id}`
                                        ) as HTMLInputElement;

                                      if (budgetInput) {
                                        // Call updateBudget directly without going through handleUpdateBudget
                                        return updateBudget(budget.id, {
                                          budgetAmount:
                                            parseFloat(budgetInput.value) || 0,
                                        });
                                      }
                                    }
                                  );

                                  await Promise.all(
                                    savePromises.filter(Boolean)
                                  );

                                  // Reload budgets only once at the end
                                  await loadBudgets();

                                  toast.success(
                                    "All budgets updated successfully!"
                                  );
                                } catch (error) {
                                  console.error("Error saving budgets:", error);
                                  toast.error("Failed to save some changes");
                                }
                              }}
                            >
                              Save All Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Budget</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the &ldquo;
                {budgetToDelete?.category}&rdquo; budget? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setBudgetToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
