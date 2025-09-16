"use client";

import GoalContent from "@/components/goals/GoalContent";
import { useGoals } from "@/hooks/queries";
import GoalsLoading from "./loading";

export default function GoalsPage() {
  const { error, isLoading } = useGoals();

  if (isLoading) {
    return <GoalsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GoalContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GoalContent />
    </div>
  );
}
