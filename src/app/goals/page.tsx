"use client";

import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DatePicker } from "@/components/ui/date-picker";
import { getCurrentUserGoals, formatCurrency } from "@/lib/data";
import { EmptyGoals } from "@/components/empty-states";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [editGoalsOpen, setEditGoalsOpen] = useState(false);

  useEffect(() => {
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

    loadGoals();
  }, []);

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
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading goals...</div>
          </div>
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
              <EmptyGoals />
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
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Savings Goal</DialogTitle>
                        <DialogDescription>
                          Create a new savings goal with your target amount and
                          timeline.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="goal-name">Goal Name</Label>
                          <Input
                            id="goal-name"
                            placeholder="e.g., Emergency Fund, Vacation, New Car"
                            className="w-full"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="target-amount">Target Amount</Label>
                          <Input
                            id="target-amount"
                            type="number"
                            placeholder="Enter target amount"
                            className="w-full"
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
                          <Select>
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
                        <Button type="submit">Create Goal</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={editGoalsOpen} onOpenChange={setEditGoalsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-32 sm:w-40">
                        Edit Goals
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Edit Savings Goals</DialogTitle>
                        <DialogDescription>
                          Modify your existing savings goals and target amounts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                        {goals.map((goal) => (
                          <div
                            key={goal.id}
                            className="grid gap-3 p-4 border rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-medium">
                                {goal.name}
                              </Label>
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
                            <div className="text-sm text-gray-600">
                              Progress: {formatCurrency(goal.currentAmount)} of{" "}
                              {formatCurrency(goal.targetAmount)} (
                              {Math.round(
                                (goal.currentAmount / goal.targetAmount) * 100
                              )}
                              %)
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditGoalsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

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
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a goal" />
                            </SelectTrigger>
                            <SelectContent>
                              {goals.map((goal) => (
                                <SelectItem
                                  key={goal.id}
                                  value={goal.id.toString()}
                                >
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
                          <Label htmlFor="contribution-amount">
                            Contribution Amount
                          </Label>
                          <Input
                            id="contribution-amount"
                            type="number"
                            placeholder="Enter amount to contribute"
                            className="w-full"
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
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Contribution</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
