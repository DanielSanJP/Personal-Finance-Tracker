import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  icon,
}: EmptyStateProps) {
  return (
    <Card className="text-center py-8">
      <CardHeader>
        {icon && (
          <div className="mx-auto mb-4 w-12 h-12 text-muted-foreground">
            {icon}
          </div>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {description}
        </p>
        {actionText && actionHref && (
          <Button asChild>
            <Link href={actionHref}>{actionText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specific empty state components
export function EmptyAccounts() {
  return (
    <EmptyState
      title="No accounts yet"
      description="You haven't added any accounts yet. Add your first account to start tracking your finances."
      actionText="Add Account"
      actionHref="/accounts/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      }
    />
  );
}

export function EmptyTransactions() {
  return (
    <EmptyState
      title="No transactions yet"
      description="You haven't recorded any transactions yet. Add your first transaction to start tracking your spending."
      actionText="Add Transaction"
      actionHref="/transactions/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      }
    />
  );
}

export function EmptyBudgets() {
  return (
    <EmptyState
      title="No budgets yet"
      description="You haven't created any budgets yet. Set up your first budget to better manage your spending."
      actionText="Create Budget"
      actionHref="/budgets/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      }
    />
  );
}

export function EmptyGoals() {
  return (
    <EmptyState
      title="No goals yet"
      description="You haven't set any financial goals yet. Create your first goal to start planning for your future."
      actionText="Create Goal"
      actionHref="/goals/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      }
    />
  );
}

export function EmptyIncome() {
  return (
    <EmptyState
      title="No income recorded yet"
      description="You haven't recorded any income yet. Add your income sources to get a complete picture of your finances."
      actionText="Add Income"
      actionHref="/income/add"
      icon={
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    />
  );
}
