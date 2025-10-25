"use client";

import ReportsContent from "@/components/reports/ReportsContent";
import { useTransactions } from "@/hooks/queries/useTransactions";
import ReportsLoading from "./loading";

export default function ReportsPage() {
  const { error, isLoading } = useTransactions();

  if (isLoading) {
    return <ReportsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ReportsContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ReportsContent />
    </div>
  );
}
