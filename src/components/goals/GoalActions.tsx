"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  useCreateGoal,
  useUpdateGoal,
  useMakeGoalContribution,
  useAccountsForGoals,
} from "@/hooks/queries";

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

interface GoalActionsProps {
  goals: Goal[];
  onGoalToDelete: (goal: Goal) => void;
  onOpenDeleteConfirm: (open: boolean) => void;
}

export default function GoalActions({
  goals,
  onGoalToDelete,
  onOpenDeleteConfirm,
}: GoalActionsProps) {
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [editGoalsOpen, setEditGoalsOpen] = useState(false);
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

  // Date states for the modals
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [contributionDate, setContributionDate] = useState<Date | undefined>(
    new Date()
  );

  // Hooks
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const makeContributionMutation = useMakeGoalContribution();
  const { data: accounts = [] } = useAccountsForGoals();

  // Handle creating a new goal
  const handleCreateGoal = async () => {
    try {
      if (!newGoal.name.trim() || !newGoal.targetAmount) {
        toast.error("Please fill in the goal name and target amount");
        return;
      }

      // Validate target date is in the future
      if (targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(targetDate);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
          toast.error("Target date must be in the future");
          return;
        }
      }

      await createGoalMutation.mutateAsync({
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
    } catch {
      // Error handling is done in the mutation
    }
  };

  // Handle making a contribution
  const handleMakeContribution = async () => {
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

      await makeContributionMutation.mutateAsync({
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
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 pb-4 justify-center [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center">
          <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
            <DialogTrigger asChild>
              <Button className="min-w-[140px]">Add New Goal</Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px] max-h-[90vh] overflow-hidden"
              onInteractOutside={(e) => {
                // Prevent closing when clicking inside a popover (date picker)
                const target = e.target as Element;
                if (target.closest('[data-slot="popover-content"]')) {
                  e.preventDefault();
                }
              }}
            >
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
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
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
                <Button
                  onClick={handleCreateGoal}
                  disabled={createGoalMutation.isPending}
                >
                  {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={editGoalsOpen} onOpenChange={setEditGoalsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[140px]"
                onClick={() => {
                  // Initialize edit target dates with current goal dates
                  const initialDates: Record<string, Date | undefined> = {};
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
            <DialogContent
              className="sm:max-w-[700px] max-h-[90vh] overflow-hidden"
              onInteractOutside={(e) => {
                // Prevent closing when clicking inside a popover (date picker)
                const target = e.target as Element;
                if (target.closest('[data-slot="popover-content"]')) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Goals</DialogTitle>
                <DialogDescription>
                  Modify your existing goals and target amounts.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                {goals.map((goal) => {
                  const handleDeleteGoalClick = () => {
                    onGoalToDelete(goal);
                    onOpenDeleteConfirm(true);
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleDeleteGoalClick}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete goal</span>
                        </Button>
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
                        Progress: {formatCurrency(goal.currentAmount)} of{" "}
                        {formatCurrency(goal.targetAmount)} (
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
                    setEditTargetDates({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={async () => {
                    try {
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

                          return updateGoalMutation.mutateAsync({
                            goalId: goal.id,
                            goalData: {
                              name: nameInput.value,
                              targetAmount: parseFloat(targetInput.value) || 0,
                              currentAmount:
                                parseFloat(currentInput.value) || 0,
                              targetDate: editDate
                                ? editDate.toISOString().split("T")[0]
                                : goal.targetDate || undefined,
                              category: goal.category || undefined,
                              priority: goal.priority || undefined,
                              status: goal.status,
                            },
                          });
                        }
                      });

                      await Promise.all(savePromises.filter(Boolean));
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

          <Dialog open={contributionOpen} onOpenChange={setContributionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="min-w-[140px]">
                Make Contribution
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px]"
              onInteractOutside={(e) => {
                // Prevent closing when clicking inside a popover (date picker)
                const target = e.target as Element;
                if (target.closest('[data-slot="popover-content"]')) {
                  e.preventDefault();
                }
              }}
            >
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
                <DateTimePicker
                  id="contribution-date"
                  date={contributionDate}
                  onDateTimeChange={setContributionDate}
                  placeholder="Select contribution date"
                  required
                  showLabel
                />
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
                <Button
                  onClick={handleMakeContribution}
                  disabled={makeContributionMutation.isPending}
                >
                  {makeContributionMutation.isPending
                    ? "Adding..."
                    : "Add Contribution"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
