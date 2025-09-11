import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateBudget } from "@/hooks/queries/useBudgets";
import { useCreateGoal } from "@/hooks/queries/useGoals";
import { getCurrentUser } from "@/lib/auth";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-8">
      <CardHeader>
        {icon && (
          <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
        {actionText && actionHref && (
          <Button asChild>
            <Link href={actionHref}>{actionText}</Link>
          </Button>
        )}
        {actionText && onAction && !actionHref && (
          <Button onClick={onAction}>{actionText}</Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specific empty state components
export function EmptyAccounts() {
  return (
    <EmptyState
      title="No accounts yet"
      description="You haven't added any accounts yet. Add your first account to start tracking your finances."
      actionText="Add Account"
      actionHref="/accounts/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      }
    />
  );
}

export function EmptyTransactions() {
  return (
    <EmptyState
      title="No transactions yet"
      description="You haven't recorded any transactions yet. Add your first transaction to start tracking your spending."
      actionText="Add Transaction"
      actionHref="/transactions/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
    />
  );
}

export function EmptyBudgets({ onRefresh }: { onRefresh?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgetAmount: "",
    period: "monthly",
  });

  const createBudgetMutation = useCreateBudget();

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

  const handleCreateBudget = async () => {
    try {
      if (!newBudget.category || !newBudget.budgetAmount) {
        toast.error("Please fill in the category and budget amount");
        return;
      }

      // Debug authentication status
      const user = await getCurrentUser();
      console.log("Current user:", user);

      if (!user) {
        toast.error("Please sign in to create budgets");
        return;
      }

      console.log("Creating budget with data:", {
        category: newBudget.category,
        budgetAmount: newBudget.budgetAmount,
        period: newBudget.period,
      });

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

      const budgetData = {
        category: newBudget.category,
        budgetAmount: parseFloat(newBudget.budgetAmount),
        period: newBudget.period,
        startDate,
        endDate,
        spentAmount: 0,
      };

      console.log("Calling createBudget with:", budgetData);

      await createBudgetMutation.mutateAsync(budgetData);

      // Reset form
      setNewBudget({
        category: "",
        budgetAmount: "",
        period: "monthly",
      });
      setIsOpen(false);

      toast.success("Budget created successfully!");

      // Refresh the parent component
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating budget:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("not authenticated")) {
          toast.error("Please sign in to create budgets");
        } else if (error.message.includes("guest mode")) {
          toast.error(
            "Cannot create budgets in guest mode. Please sign in to continue."
          );
        } else if (error.message.includes("Failed to create budget")) {
          toast.error(
            "Failed to create budget. Please check your connection and try again."
          );
        } else {
          toast.error(`Failed to create budget: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred while creating the budget");
      }
    }
  };

  return (
    <Card className="text-center py-8">
      <CardHeader>
        <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl">No budgets yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven&apos;t created any budgets yet. Set up your first budget to
          better manage your spending.
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create Budget</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
              <DialogDescription>
                Create a new budget category with your desired spending limit.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newBudget.category}
                  onValueChange={(value) =>
                    setNewBudget({ ...newBudget, category: value })
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
                    <SelectItem value="monthly">Monthly</SelectItem>
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
      </CardContent>
    </Card>
  );
}

export function EmptyGoals({ onRefresh }: { onRefresh?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    priority: "medium",
  });

  const createGoalMutation = useCreateGoal();

  const handleCreateGoal = async () => {
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

      console.log("Creating goal with data:", {
        name: newGoal.name.trim(),
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount,
        priority: newGoal.priority,
      });

      const goalData = {
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
      };

      console.log("Calling createGoal with:", goalData);

      await createGoalMutation.mutateAsync(goalData);

      // Reset form
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        priority: "medium",
      });
      setTargetDate(undefined);
      setIsOpen(false);

      toast.success("Goal created successfully!");

      // Refresh the parent component
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error creating goal:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("not authenticated")) {
          toast.error("Please sign in to create goals");
        } else if (error.message.includes("guest mode")) {
          toast.error(
            "Cannot create goals in guest mode. Please sign in to continue."
          );
        } else if (error.message.includes("Failed to create goal")) {
          toast.error(
            "Failed to create goal. Please check your connection and try again."
          );
        } else {
          toast.error(`Failed to create goal: ${error.message}`);
        }
      } else {
        toast.error("An unexpected error occurred while creating the goal");
      }
    }
  };

  return (
    <Card className="text-center py-8">
      <CardHeader>
        <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl">No goals yet</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          You haven&apos;t set any financial goals yet. Create your first goal
          to start planning for your future.
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create Goal</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Savings Goal</DialogTitle>
              <DialogDescription>
                Create a new savings goal with your target amount and timeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
                  fromDate={new Date()} // Only allow dates from today onwards
                  disabled={(date) => date < new Date()} // Disable past dates
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
              <Button type="submit" onClick={handleCreateGoal}>
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function EmptyIncome() {
  return (
    <EmptyState
      title="No income recorded yet"
      description="You haven't recorded any income yet. Add your income sources to get a complete picture of your finances."
      actionText="Add Income"
      actionHref="/income/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}
