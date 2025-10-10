import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Target } from "lucide-react";

export default function BudgetsOverviewPage() {
  return (
    <GuideLayout
      title="Budgets Overview"
      description="Learn how budgets help you manage and control your spending"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Budgets are a powerful tool for managing your finances. Set spending
          limits for different categories and track your progress throughout the
          month to stay on top of your financial goals.
        </p>

        <div className="my-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            What are Budgets?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A budget is a spending limit you set for a specific category (like
            Groceries, Dining, or Transportation) over a period of time (usually
            monthly). Personal Finance Tracker automatically tracks how much
            you&apos;ve spent in each category and shows your progress toward
            your budget limits.
          </p>
        </div>

        <div className="my-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Key Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Category-Based Budgets
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create separate budgets for each spending category. This helps
                  you understand where your money goes and control spending in
                  specific areas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Real-Time Tracking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your budget automatically updates as you add transactions. See
                  exactly how much you&apos;ve spent and how much is left in
                  each category.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Visual Progress Bars
                </h3>
                <p className="text-sm text-muted-foreground">
                  Progress bars show your spending at a glance. Colors change
                  from gray (under 80%) to orange (80-100%) to red (over budget)
                  to warn you before overspending.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Budget Periods
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose between monthly, weekly, or yearly budget periods.
                  Monthly is the most popular option for regular expense
                  management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            How Budgets Work
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>
              <strong className="text-foreground">Create a budget</strong> by
              selecting a category and setting a spending limit
            </li>
            <li>
              <strong className="text-foreground">Add your transactions</strong>{" "}
              as usual throughout the month
            </li>
            <li>
              <strong className="text-foreground">Track your progress</strong>{" "}
              with visual progress bars and spending totals
            </li>
            <li>
              <strong className="text-foreground">Get alerted</strong> when
              you&apos;re approaching or exceeding your budget limits
            </li>
            <li>
              <strong className="text-foreground">Adjust as needed</strong> by
              editing budget amounts or changing categories
            </li>
          </ol>
        </div>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">
            Getting Started
          </h3>
          <p className="text-sm text-muted-foreground">
            Start by creating budgets for your most frequent expense categories.
            Common categories include Groceries, Dining, Transportation, and
            Entertainment. You can always add more budgets or adjust amounts as
            you learn your spending patterns.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
