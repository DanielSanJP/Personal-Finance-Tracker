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
import { useState } from "react";

export default function GoalsPage() {
  const goals = getCurrentUserGoals();
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [contributionOpen, setContributionOpen] = useState(false);

  // Progress calculation function
  const getProgressWidth = (current: number, target: number) => {
    if (current === 0 || target === 0) return 0;
    const percentage = Math.min((current / target) * 100, 100);
    return percentage;
  };

  // Date states for the modals
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [contributionDate, setContributionDate] = useState<Date | undefined>(
    new Date()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Savings Goals
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {goals.map((goal, index) => {
              const progressWidth = getProgressWidth(
                goal.currentAmount,
                goal.targetAmount
              );

              return (
                <div key={goal.id}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">{goal.name}</span>
                      <span className="text-base text-gray-600">
                        {formatCurrency(goal.currentAmount)} /{" "}
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all bg-gray-900"
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>

                    <div className="text-sm text-gray-600">
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  </div>

                  {index < goals.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <div className="flex gap-4">
                <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-3 text-base font-semibold cursor-pointer">
                      Add New Goal
                    </Button>
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
                            <SelectItem value="high">High Priority</SelectItem>
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
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Create Goal
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={contributionOpen}
                  onOpenChange={setContributionOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 py-3 text-base font-semibold border-gray-300 bg-white text-black hover:bg-gray-50 cursor-pointer"
                    >
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
                      <Button
                        type="submit"
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Add Contribution
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
                  Edit Goals
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
