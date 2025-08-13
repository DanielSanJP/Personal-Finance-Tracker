"use client";

import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoalsListSkeleton } from "@/components/loading-states";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  getCurrentUserGoals,
  formatCurrency,
  createGoal,
  updateGoal,
  deleteGoal,
  makeGoalContribution,
  getCurrentUserAccounts,
} from "@/lib/data";
import { EmptyGoals } from "@/components/empty-states";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";

interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  category: string | null;
  priority: string | null;
  status: string;
}

interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: string;
  accountNumber: string;
  isActive: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [editGoalsOpen, setEditGoalsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [editTargetDates, setEditTargetDates] = useState<
    Record<string, Date | undefined>
  >({});

  // Form states for adding goals
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    priority: "medium",
  });

  // Form states for contributions
  const [contribution, setContribution] = useState({
    goalId: "",
    accountId: "",
    amount: "",
    notes: "",
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserGoals();
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading goals:", error);
      setGoals([]);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const data = await getCurrentUserAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading accounts:", error);
      setAccounts([]);
    }
  };

  useEffect(() => {
    loadGoals();
    loadAccounts();
  }, []);

  // Handle creating a new goal
  const handleCreateGoal = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("create goals");
    if (isGuest) return;

    try {
      if (!newGoal.name.trim() || !newGoal.targetAmount) {
        toast.error("Please fill in the goal name and target amount");
        return;
      }

      // Validate target date is in the future
      if (targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        const selectedDate = new Date(targetDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
          toast.error("Target date must be in the future");
          return;
        }
      }

      await createGoal({
        name: newGoal.name.trim(),
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: newGoal.currentAmount
          ? parseFloat(newGoal.currentAmount)
          : 0,
        targetDate: targetDate
          ? targetDate.toISOString().split("T")[0]
          : undefined,
        priority: newGoal.priority,
        status: "active",
      });

      // Reset form
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        priority: "medium",
      });
      setTargetDate(undefined);
      setAddGoalOpen(false);

      // Reload goals
      await loadGoals();

      toast.success("Goal created successfully!");
    } catch (error) {
      console.error("Error creating goal:", error);
      toast.error("Failed to create goal");
    }
  };

  // Handle updating a goal
  const handleUpdateGoal = async (
    goalId: string,
    goalData: {
      name?: string;
      targetAmount?: number;
      currentAmount?: number;
      targetDate?: string | null;
      category?: string | null;
      priority?: string | null;
      status?: string;
    },
    closeModal: boolean = false
  ) => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("edit goals");
    if (isGuest) return;

    // Validate target date is in the future (if provided)
    if (goalData.targetDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(goalData.targetDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        toast.error("Target date must be in the future");
        return;
      }
    }

    try {
      // Convert null values to undefined for the API
      const apiData = {
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        currentAmount: goalData.currentAmount,
        targetDate: goalData.targetDate || undefined,
        category: goalData.category || undefined,
        priority: goalData.priority || undefined,
        status: goalData.status,
      };

      await updateGoal(goalId, apiData);

      // Reload goals
      await loadGoals();

      if (closeModal) {
        setEditGoalsOpen(false);
        setEditTargetDates({});
      }

      toast.success("Goal updated successfully!");
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update goal");
    }
  };

  // Handle deleting a goal
  const handleDeleteGoal = async (goalId: string) => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("delete goals");
    if (isGuest) return;

    try {
      await deleteGoal(goalId);

      // Reload goals
      await loadGoals();

      toast.success("Goal deleted successfully!");
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (goalToDelete) {
      await handleDeleteGoal(goalToDelete.id);
      setDeleteConfirmOpen(false);
      setGoalToDelete(null);
    }
  };

  // Handle making a contribution
  const handleMakeContribution = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("make goal contributions");
    if (isGuest) return;

    try {
      if (
        !contribution.goalId ||
        !contribution.accountId ||
        !contribution.amount
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const amount = parseFloat(contribution.amount);
      if (amount <= 0) {
        toast.error("Contribution amount must be greater than 0");
        return;
      }

      // Check if account has sufficient balance
      const selectedAccount = accounts.find(
        (acc) => acc.id === contribution.accountId
      );
      if (!selectedAccount) {
        toast.error("Selected account not found");
        return;
      }

      if (selectedAccount.balance < amount) {
        toast.error("Insufficient account balance");
        return;
      }

      await makeGoalContribution({
        goalId: contribution.goalId,
        accountId: contribution.accountId,
        amount: amount,
        date: contributionDate || new Date(),
        notes: contribution.notes || undefined,
      });

      // Reset form
      setContribution({
        goalId: "",
        accountId: "",
        amount: "",
        notes: "",
      });
      setContributionDate(new Date());
      setContributionOpen(false);

      // Reload goals and accounts
      await loadGoals();
      await loadAccounts();

      toast.success("Contribution made successfully!");
    } catch (error) {
      console.error("Error making contribution:", error);
      toast.error("Failed to make contribution");
    }
  };

  // Helper function for calculating progress percentage
  const getProgressWidth = (current: number, target: number) => {
    if (current === 0 || target === 0) return 0;
    const percentage = Math.min((current / target) * 100, 100);
    return percentage;
  };

  // Check if goal is achieved
  const isGoalAchieved = (current: number, target: number) => {
    return current >= target;
  };

  // Date states for the modals
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [contributionDate, setContributionDate] = useState<Date | undefined>(
    new Date()
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No target date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <GoalsListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Savings Goals
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {goals.length === 0 ? (
              <EmptyGoals onRefresh={loadGoals} />
            ) : (
              goals.map((goal, index) => {
                const progressWidth = getProgressWidth(
                  goal.currentAmount,
                  goal.targetAmount
                );
                const goalAchieved = isGoalAchieved(
                  goal.currentAmount,
                  goal.targetAmount
                );

                return (
                  <div key={goal.id}>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                        <span className="text-sm sm:text-base font-medium">
                          {goal.name}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600">
                          {formatCurrency(goal.currentAmount)} /{" "}
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            goalAchieved ? "bg-green-600" : "bg-gray-900"
                          }`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>

                      <div className="text-sm text-gray-600">
                        <span>Target: {formatDate(goal.targetDate)}</span>
                      </div>

                      {goalAchieved && (
                        <div className="text-sm font-medium text-green-600">
                          🎉 Goal Achieved!
                        </div>
                      )}
                    </div>

                    {index < goals.length - 1 && <Separator className="mt-4" />}
                  </div>
                );
              })
            )}

            {/* Action Buttons - Only show when there are goals */}
            {goals.length > 0 && (
              <div className="pt-4 space-y-4 flex flex-col items-center">
                <div className="flex flex-wrap gap-4 justify-center">
                  <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-32 sm:w-40">Add New Goal</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>Add New Savings Goal</DialogTitle>
                        <DialogDescription>
                          Create a new savings goal with your target amount and
                          timeline.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                        <div className="grid gap-2">
                          <Label htmlFor="goal-name">Goal Name</Label>
                          <Input
                            id="goal-name"
                            placeholder="e.g., Emergency Fund, Vacation, New Car"
                            className="w-full"
                            value={newGoal.name}
                            onChange={(e) =>
                              setNewGoal({ ...newGoal, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="target-amount">Target Amount</Label>
                          <Input
                            id="target-amount"
                            type="number"
                            placeholder="Enter target amount"
                            className="w-full"
                            value={newGoal.targetAmount}
                            onChange={(e) =>
                              setNewGoal({
                                ...newGoal,
                                targetAmount: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="current-amount">
                            Current Amount (Optional)
                          </Label>
                          <Input
                            id="current-amount"
                            type="number"
                            placeholder="Enter current savings amount"
                            className="w-full"
                            value={newGoal.currentAmount}
                            onChange={(e) =>
                              setNewGoal({
                                ...newGoal,
                                currentAmount: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="target-date">Target Date</Label>
                          <DatePicker
                            id="target-date"
                            date={targetDate}
                            onDateChange={setTargetDate}
                            placeholder="Select target date"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select
                            value={newGoal.priority}
                            onValueChange={(value) =>
                              setNewGoal({ ...newGoal, priority: value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                High Priority
                              </SelectItem>
                              <SelectItem value="medium">
                                Medium Priority
                              </SelectItem>
                              <SelectItem value="low">Low Priority</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAddGoalOpen(false);
                            // Reset form
                            setNewGoal({
                              name: "",
                              targetAmount: "",
                              currentAmount: "",
                              priority: "medium",
                            });
                            setTargetDate(undefined);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" onClick={handleCreateGoal}>
                          Create Goal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editGoalsOpen} onOpenChange={setEditGoalsOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-32 sm:w-40"
                        onClick={() => {
                          // Initialize edit target dates with current goal dates
                          const initialDates: Record<string, Date | undefined> =
                            {};
                          goals.forEach((goal) => {
                            if (goal.targetDate) {
                              initialDates[goal.id] = new Date(goal.targetDate);
                            }
                          });
                          setEditTargetDates(initialDates);
                        }}
                      >
                        Edit Goals
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle>Edit Savings Goals</DialogTitle>
                        <DialogDescription>
                          Modify your existing savings goals and target amounts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                        {goals.map((goal) => {
                          const handleSaveGoal = () => {
                            const nameInput = document.getElementById(
                              `goal-name-${goal.id}`
                            ) as HTMLInputElement;
                            const targetInput = document.getElementById(
                              `target-${goal.id}`
                            ) as HTMLInputElement;
                            const currentInput = document.getElementById(
                              `current-${goal.id}`
                            ) as HTMLInputElement;

                            if (nameInput && targetInput && currentInput) {
                              const editDate = editTargetDates[goal.id];
                              handleUpdateGoal(
                                goal.id,
                                {
                                  name: nameInput.value,
                                  targetAmount:
                                    parseFloat(targetInput.value) || 0,
                                  currentAmount:
                                    parseFloat(currentInput.value) || 0,
                                  targetDate: editDate
                                    ? editDate.toISOString().split("T")[0]
                                    : goal.targetDate,
                                },
                                true
                              ); // Close modal after individual save
                            }
                          };

                          const handleDeleteGoalClick = () => {
                            setGoalToDelete(goal);
                            setDeleteConfirmOpen(true);
                          };

                          return (
                            <div
                              key={goal.id}
                              className="grid gap-3 p-4 border rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-medium">
                                  {goal.name}
                                </Label>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSaveGoal}>
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={handleDeleteGoalClick}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`goal-name-${goal.id}`}>
                                  Goal Name
                                </Label>
                                <Input
                                  id={`goal-name-${goal.id}`}
                                  defaultValue={goal.name}
                                  className="w-full"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`target-${goal.id}`}>
                                  Target Amount
                                </Label>
                                <Input
                                  id={`target-${goal.id}`}
                                  type="number"
                                  defaultValue={goal.targetAmount}
                                  className="w-full"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`current-${goal.id}`}>
                                  Current Amount
                                </Label>
                                <Input
                                  id={`current-${goal.id}`}
                                  type="number"
                                  defaultValue={goal.currentAmount}
                                  className="w-full"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`target-date-${goal.id}`}>
                                  Target Date
                                </Label>
                                <DatePicker
                                  id={`target-date-${goal.id}`}
                                  date={
                                    editTargetDates[goal.id] ||
                                    (goal.targetDate
                                      ? new Date(goal.targetDate)
                                      : undefined)
                                  }
                                  onDateChange={(date) => {
                                    setEditTargetDates((prev) => ({
                                      ...prev,
                                      [goal.id]: date,
                                    }));
                                  }}
                                  placeholder="Select target date"
                                />
                              </div>
                              <div className="text-sm text-gray-600">
                                Progress: {formatCurrency(goal.currentAmount)}{" "}
                                of {formatCurrency(goal.targetAmount)} (
                                {Math.round(
                                  (goal.currentAmount / goal.targetAmount) * 100
                                )}
                                %)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditGoalsOpen(false);
                            // Reset edit target dates
                            setEditTargetDates({});
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          onClick={async () => {
                            // Save all goals at once without individual reloads
                            try {
                              // Close modal immediately to prevent flickering
                              setEditGoalsOpen(false);
                              setEditTargetDates({});

                              const savePromises = goals.map(async (goal) => {
                                const nameInput = document.getElementById(
                                  `goal-name-${goal.id}`
                                ) as HTMLInputElement;
                                const targetInput = document.getElementById(
                                  `target-${goal.id}`
                                ) as HTMLInputElement;
                                const currentInput = document.getElementById(
                                  `current-${goal.id}`
                                ) as HTMLInputElement;

                                if (nameInput && targetInput && currentInput) {
                                  const editDate = editTargetDates[goal.id];

                                  // Convert null values to undefined for the API
                                  const apiData = {
                                    name: nameInput.value,
                                    targetAmount:
                                      parseFloat(targetInput.value) || 0,
                                    currentAmount:
                                      parseFloat(currentInput.value) || 0,
                                    targetDate: editDate
                                      ? editDate.toISOString().split("T")[0]
                                      : goal.targetDate || undefined,
                                    category: goal.category || undefined,
                                    priority: goal.priority || undefined,
                                    status: goal.status,
                                  };

                                  // Call updateGoal directly without going through handleUpdateGoal
                                  return updateGoal(goal.id, apiData);
                                }
                              });

                              await Promise.all(savePromises.filter(Boolean));

                              // Reload goals only once at the end
                              await loadGoals();

                              toast.success("All goals updated successfully!");
                            } catch (error) {
                              console.error("Error saving goals:", error);
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
                  <Dialog
                    open={contributionOpen}
                    onOpenChange={setContributionOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-32 sm:w-40">
                        Make Contribution
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Make a Contribution</DialogTitle>
                        <DialogDescription>
                          Add money to one of your existing savings goals.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="goal-select">Select Goal</Label>
                          <Select
                            value={contribution.goalId}
                            onValueChange={(value) =>
                              setContribution({
                                ...contribution,
                                goalId: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a goal" />
                            </SelectTrigger>
                            <SelectContent>
                              {goals.map((goal) => (
                                <SelectItem key={goal.id} value={goal.id}>
                                  <div className="flex flex-col">
                                    <span>{goal.name}</span>
                                    <span className="text-sm text-gray-500">
                                      {formatCurrency(goal.currentAmount)} /{" "}
                                      {formatCurrency(goal.targetAmount)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="account-select">Select Account</Label>
                          <Select
                            value={contribution.accountId}
                            onValueChange={(value) =>
                              setContribution({
                                ...contribution,
                                accountId: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose an account" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                  <div className="flex flex-col">
                                    <span>{account.name}</span>
                                    <span className="text-sm text-gray-500">
                                      Balance: {formatCurrency(account.balance)}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contribution-amount">
                            Contribution Amount
                          </Label>
                          <Input
                            id="contribution-amount"
                            type="number"
                            placeholder="Enter amount to contribute"
                            className="w-full"
                            value={contribution.amount}
                            onChange={(e) =>
                              setContribution({
                                ...contribution,
                                amount: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="contribution-date">
                            Contribution Date
                          </Label>
                          <DatePicker
                            id="contribution-date"
                            date={contributionDate}
                            onDateChange={setContributionDate}
                            placeholder="Select contribution date"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Input
                            id="notes"
                            placeholder="Add a note about this contribution"
                            className="w-full"
                            value={contribution.notes}
                            onChange={(e) =>
                              setContribution({
                                ...contribution,
                                notes: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setContributionOpen(false);
                            // Reset contribution form and date
                            setContribution({
                              goalId: "",
                              accountId: "",
                              amount: "",
                              notes: "",
                            });
                            setContributionDate(new Date());
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" onClick={handleMakeContribution}>
                          Add Contribution
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Goal</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{goalToDelete?.name}
                &rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setGoalToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
