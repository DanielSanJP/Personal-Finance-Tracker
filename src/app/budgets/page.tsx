"use client";

import { BudgetContent } from "@/components/budgets/BudgetContent";
import { useBudgets } from "@/hooks/queries";
import BudgetsLoading from "./loading";

export default function BudgetsPage() {
  const { data: budgets = [], isLoading, error, refetch } = useBudgets();

  // Handle loading state
  if (isLoading) {
    return <BudgetsLoading />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-red-600">
            <p>Error loading budgets: {error?.message || "Unknown error"}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BudgetContent budgets={budgets} onRefresh={refetch} />
    </div>
  );
}
