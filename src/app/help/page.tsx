"use client";

import Nav from "@/components/nav";
import HelpContent from "@/components/help/HelpContent";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <HelpContent />
    </div>
  );
}
