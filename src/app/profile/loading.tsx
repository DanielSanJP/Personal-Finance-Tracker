"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Nav from "@/components/nav";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile form fields */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <div className="pt-4 flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
