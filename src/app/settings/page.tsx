"use client";

import SettingsContent from "@/components/settings/SettingsContent";
import { useAuth } from "@/hooks/queries";
import SettingsLoading from "./loading";

export default function SettingsPage() {
  const { error, isLoading } = useAuth();

  if (isLoading) {
    return <SettingsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SettingsContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsContent />
    </div>
  );
}
