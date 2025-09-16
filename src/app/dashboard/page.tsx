"use client";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/hooks/queries";
import DashboardLoading from "./loading";

export default function Dashboard() {
  const { data: dashboardData, error, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent />
    </div>
  );
}
