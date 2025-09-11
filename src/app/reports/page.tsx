"use client";

import Nav from "@/components/nav";
import ReportsContent from "@/components/reports/ReportsContent";
import { useTransactions } from "@/hooks/queries";
import ReportsLoading from "./loading";

export default function ReportsPage() {
  const { error, isLoading } = useTransactions();

  if (isLoading) {
    return <ReportsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <ReportsContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <ReportsContent />
    </div>
  );
}
