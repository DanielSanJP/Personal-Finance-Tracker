"use client";

import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

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

interface GoalListProps {
  goals: Goal[];
  isLoading?: boolean;
}

export default function GoalList({ goals, isLoading }: GoalListProps) {
  // Helper function to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No target date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper function to get progress width
  const getProgressWidth = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100);
  };

  // Helper function to check if goal is achieved
  const isGoalAchieved = (current: number, target: number) => {
    return current >= target;
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading goals...</div>;
  }

  return (
    <div className="space-y-6">
      {goals.map((goal, index) => {
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
                <span className="text-sm sm:text-base text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} /{" "}
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all ${
                    goalAchieved ? "bg-green-600" : "bg-foreground"
                  }`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <span>Target: {formatDate(goal.targetDate)}</span>
              </div>

              {goalAchieved && (
                <div className="text-sm font-medium text-green-600">
                  ðŸŽ‰ Goal Achieved!
                </div>
              )}
            </div>

            {index < goals.length - 1 && <Separator className="mt-4" />}
          </div>
        );
      })}
    </div>
  );
}
