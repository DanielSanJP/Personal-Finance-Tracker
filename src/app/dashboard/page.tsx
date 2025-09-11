"use client";

import Nav from "@/components/nav";
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
        <Nav showDashboardTabs={true} />
        <DashboardContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <DashboardContent />
    </div>
  );
}
