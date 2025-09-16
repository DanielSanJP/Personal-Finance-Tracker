"use client";

import ProfileContent from "@/components/profile/ProfileContent";
import { useAuth } from "@/hooks/queries";
import ProfileLoading from "./loading";

export default function ProfilePage() {
  const { error, isLoading } = useAuth();

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfileContent />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileContent />
    </div>
  );
}
