"use client";

import Nav from "@/components/nav";
import PreferencesContent from "@/components/preferences/PreferencesContent";
import { useAuth } from "@/hooks/queries";
import PreferencesLoading from "./loading";

export default function PreferencesPage() {
  const { error, isLoading } = useAuth();

  if (isLoading) {
    return <PreferencesLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <PreferencesContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <PreferencesContent />
    </div>
  );
}
