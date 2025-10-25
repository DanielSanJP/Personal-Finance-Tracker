import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CreditCard, BarChart3, Zap } from "lucide-react";

export default function UnderstandingDashboardPage() {
  return (
    <GuideLayout
      title="Understanding the Dashboard"
      description="Learn about the main features and sections of your Personal Finance Tracker dashboard"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          The dashboard is your command center for managing your finances. It
          provides a quick overview of your financial situation and easy access
          to all major features.
        </p>

        <div className="my-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Dashboard Sections
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Quick Actions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Fast access to common tasks like adding transactions,
                  recording income, or creating budgets. Get things done with
                  one click.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Financial Summary
                </h3>
                <p className="text-sm text-muted-foreground">
                  View your total balance, income, and expenses at a glance.
                  This section updates in real-time as you add transactions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Spending Chart
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visual breakdown of your spending by category. See where your
                  money is going with interactive charts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Accounts Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  View all your connected accounts and their current balances.
                  Quickly switch between accounts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <GuideStep
          stepNumber={1}
          title="Navigate the Top Bar"
          image="/guides/dashboard/navigatetopbar.png"
        >
          <p>
            The top navigation bar provides quick access to main sections:
            Dashboard, Transactions, Budgets, Goals, Reports, Accounts, and
            more. Click any item to navigate to that section.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Use Quick Actions"
          image="/guides/dashboard/quickactions.png"
        >
          <p>
            The <strong>&quot;Quick Actions&quot;</strong> card provides
            one-click access to common tasks:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Add Income:</strong> Quickly record income transactions
            </li>
            <li>
              <strong>Add Expense:</strong> Record a new expense transaction
            </li>
            <li>
              <strong>Scan Receipt:</strong> Use your camera to scan and add
              receipts
            </li>
            <li>
              <strong>View Reports:</strong> Access your financial reports
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Financial Summary Cards"
          image="/guides/dashboard/summary.png"
          imageAlt="Financial summary showing total balance, monthly income, and monthly expenses"
        >
          <p>
            The four summary cards at the top display your key financial metrics
            for the current month:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Total Balance:</strong> Combined balance across all your
              accounts
            </li>
            <li>
              <strong>Monthly Income:</strong> Total income received this month
            </li>
            <li>
              <strong>Monthly Expenses:</strong> Total amount spent this month
            </li>
            <li>
              <strong>Budget Remaining:</strong> Total budget remaining for the
              month
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            These cards update automatically as you add new transactions,
            providing real-time insights into your financial health.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Spending Chart"
          image="/guides/dashboard/spending-chart.png"
          imageAlt="Category spending breakdown pie chart"
        >
          <p>
            The <strong>&quot;Spending Chart&quot;</strong> section displays a
            visual breakdown of your expenses by category:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              View which categories consume the most of your budget (Food &
              Dining, Transportation, etc.)
            </li>
            <li>
              Hover over chart segments to see exact amounts and percentages
            </li>
            <li>Quickly identify spending patterns and areas to optimize</li>
            <li>
              Color-coded segments make it easy to compare different categories
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Click &quot;View Reports&quot; below the chart to access more
            detailed analytics and export options.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Accounts Overview"
          image="/guides/dashboard/accounts.png"
          imageAlt="List of accounts showing names, types, and current balances"
        >
          <p>
            The <strong>&quot;Accounts Overview&quot;</strong> section shows all
            your connected accounts at a glance:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Account Name:</strong> Customizable name for each account
              (e.g., &quot;Main Checking&quot;, &quot;Savings&quot;)
            </li>
            <li>
              <strong>Account Type:</strong> Checking, Savings, Credit, or
              Investment
            </li>
            <li>
              <strong>Current Balance:</strong> Up-to-date balance for each
              account
            </li>
            <li>
              Click on any account to view detailed transaction history and
              manage account settings
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            Keep your accounts updated to ensure accurate financial tracking and
            reporting.
          </p>
        </GuideStep>
      </div>
    </GuideLayout>
  );
}
