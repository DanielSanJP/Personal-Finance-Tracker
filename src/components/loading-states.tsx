import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fast Loading Components using shadcn/ui Skeleton
 *
 * Optimized for speed and performance:
 * - Minimal DOM elements
 * - No custom animations
 * - Lightweight rendering
 *
 * Usage Examples:
 *
 * // For budget pages
 * {loading ? <BudgetListSkeleton /> : <BudgetList />}
 *
 * // For goals pages
 * {loading ? <GoalsListSkeleton /> : <GoalsList />}
 *
 * // For dashboard
 * {loading ? <DashboardSkeleton /> : <Dashboard />}
 *
 * // For accounts pages
 * {loading ? <AccountsListSkeleton /> : <AccountsList />}
 *
 * // For transactions pages
 * {loading ? <TransactionsListSkeleton /> : <TransactionsList />}
 *
 * // For add/edit forms (NEW - FAST)
 * {loading ? <FormSkeleton /> : <Form />}
 *
 * // For simple loading states
 * {loading ? <SimpleLoading /> : <Content />}
 *
 * // For quick inline loading
 * {loading ? <QuickLoading /> : <Text />}
 *
 * // For page-level loading
 * {loading ? <PageLoading /> : <Page />}
 */

// General page loading component (optimized)
export function PageLoading() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

// Budget list loading skeleton
export function BudgetListSkeleton() {
  return (
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
  );
}

// Goals list loading skeleton
export function GoalsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal items skeleton */}
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-28" />
            {index < 3 && <div className="border-t pt-4" />}
          </div>
        ))}

        {/* Action buttons skeleton */}
        <div className="pt-4 space-y-4 flex flex-col items-center">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Fast Dashboard loading skeleton (ultra-lightweight)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary cards - simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart area - simplified */}
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>

      {/* Accounts - simplified */}
      <Card>
        <CardContent className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Accounts loading skeleton
export function AccountsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="pt-4 flex justify-center">
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// Transactions loading skeleton
export function TransactionsListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-56 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="pt-4 flex justify-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// Simple loading component for small areas
export function SimpleLoading({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
}

// Form loading skeleton for add pages (faster, lighter)
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Amount field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Description field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Category/Source field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Account field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-18" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Date field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Additional field */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Submit button */}
      <div className="pt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Quick loading for small components (ultra-fast)
export function QuickLoading() {
  return <Skeleton className="h-4 w-20" />;
}

// Instant loading for immediate display (minimal DOM)
export function InstantSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded">
            <Skeleton className="h-4 w-12 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
