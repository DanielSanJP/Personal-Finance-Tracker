"use client";

import { useAuth } from "@/hooks/queries/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth or during redirect
  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen">
        <div className="font-sans flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-lg text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome message only for unauthenticated users
  return (
    <div className="min-h-screen">
      <div className="font-sans flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-center">
            Welcome to your personal finance tracker
          </p>
        </div>
      </div>
    </div>
  );
}
