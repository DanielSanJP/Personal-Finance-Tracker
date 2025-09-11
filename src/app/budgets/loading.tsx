"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Nav from "@/components/nav";

export default function BudgetsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Budget items skeleton */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                {index < 2 && <div className="border-t pt-4" />}
              </div>
            ))}

            {/* Summary section skeleton */}
            <div className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="text-center space-y-2">
                    <Skeleton className="h-4 w-20 mx-auto" />
                    <Skeleton className="h-8 w-16 mx-auto" />
                  </div>
                ))}
              </div>

              {/* Overall progress skeleton */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="pt-4 space-y-4 flex flex-col items-center">
              <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
