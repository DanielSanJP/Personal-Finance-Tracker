"use client";

import { PieChart } from "@/components/pie-chart";
import { BarChart } from "@/components/bar-chart";

export default function ReportsContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Pie Chart Card - Budget spending by category */}
      <PieChart />

      {/* Bar Chart Card - Yearly spending analysis */}
      <BarChart />
    </div>
  );
}
