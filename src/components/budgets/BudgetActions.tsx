"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
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
import { CategorySelect } from "@/components/category-select";
import { toast } from "sonner";
import {
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/hooks/queries";
import { formatCurrency } from "@/lib/utils";

interface Budget {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  period: string;
}

interface BudgetActionsProps {
  budgets: Budget[];
}

export default function BudgetActions({ budgets }: BudgetActionsProps) {
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [editBudgetsOpen, setEditBudgetsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgetAmount: "",
    period: "monthly",
  });

  const createBudgetMutation = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

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

  const handleUpdateBudget = async (
    budgetId: string,
    updates: Partial<Budget>,
    closeModal = false
  ) => {
    try {
      await updateBudget.mutateAsync({
        id: budgetId,
        budgetData: { budgetAmount: updates.budgetAmount || 0 },
      });
      if (closeModal) {
        setEditBudgetsOpen(false);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!budgetToDelete) return;

    try {
      await deleteBudget.mutateAsync(budgetToDelete.id);
      setDeleteConfirmOpen(false);
      setBudgetToDelete(null);
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

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

      await createBudgetMutation.mutateAsync({
        category: newBudget.category,
        budgetAmount: parseFloat(newBudget.budgetAmount),
        period: newBudget.period,
        startDate,
        endDate,
      });

      // Reset form on success
      setNewBudget({
        category: "",
        budgetAmount: "",
        period: "monthly",
      });
      setAddBudgetOpen(false);
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="pb-4 flex flex-wrap gap-4 justify-center border-b">
      <Dialog open={addBudgetOpen} onOpenChange={setAddBudgetOpen}>
        <DialogTrigger asChild>
          <Button>Add Budget</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>
              Create a new budget to track your spending in a specific category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <CategorySelect
                value={newBudget.category}
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, category: value })
                }
                placeholder="Select a category"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <Input
                id="budgetAmount"
                type="number"
                placeholder="Enter budget amount"
                value={newBudget.budgetAmount}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, budgetAmount: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={newBudget.period}
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, period: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
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
                setNewBudget({
                  category: "",
                  budgetAmount: "",
                  period: "monthly",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBudget}
              disabled={createBudgetMutation.isPending}
            >
              {createBudgetMutation.isPending ? "Creating..." : "Create Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editBudgetsOpen} onOpenChange={setEditBudgetsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Budgets</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Budget Categories</DialogTitle>
            <DialogDescription>
              Modify your existing budget amounts and categories.
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
                      budgetAmount: parseFloat(budgetInput.value) || 0,
                    },
                    true
                  );
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
                      <Button size="sm" onClick={handleSaveBudget}>
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
                    <Label htmlFor={`budget-${budget.id}`}>Budget Amount</Label>
                    <Input
                      id={`budget-${budget.id}`}
                      type="number"
                      defaultValue={budget.budgetAmount}
                      className="w-full"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Current spending: {formatCurrency(budget.spentAmount)}
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
                try {
                  setEditBudgetsOpen(false);

                  const savePromises = budgets.map(async (budget) => {
                    const budgetInput = document.getElementById(
                      `budget-${budget.id}`
                    ) as HTMLInputElement;

                    if (budgetInput) {
                      return updateBudget.mutateAsync({
                        id: budget.id,
                        budgetData: {
                          budgetAmount: parseFloat(budgetInput.value) || 0,
                        },
                      });
                    }
                  });

                  await Promise.all(savePromises.filter(Boolean));
                  toast.success("All budgets updated successfully!");
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

      <Button
        variant="outline"
        onClick={() =>
          toast("Export Data functionality not implemented yet", {
            description: "This feature will be available in a future update.",
            action: {
              label: "Dismiss",
              onClick: () => console.log("Dismissed"),
            },
          })
        }
      >
        Export Data
      </Button>

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
  );
}
