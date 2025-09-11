"use client";

import Nav from "@/components/nav";
import { BudgetContent } from "@/components/budgets/BudgetContent";
import { useBudgets } from "@/hooks/queries";
import BudgetsLoading from "./loading";

export default function BudgetsPage() {
  const { error, isLoading } = useBudgets();

  if (isLoading) {
    return <BudgetsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <BudgetContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <BudgetContent />
    </div>
  );
}
