import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const transactionGuides = [
  {
    title: "Adding an Expense Transaction",
    description:
      "Learn how to record expenses manually, with voice input, or by scanning receipts",
    href: "/guides/transactions/adding-expense",
  },
  {
    title: "Adding Income",
    description:
      "Track your income sources and earnings in your Personal Finance Tracker",
    href: "/guides/transactions/adding-income",
  },
  {
    title: "Editing Transactions",
    description:
      "Make changes to existing transactions to keep your records accurate",
    href: "/guides/transactions/editing",
  },
  {
    title: "Viewing Transaction Details",
    description:
      "Access detailed information about any transaction including receipts and notes",
    href: "/guides/transactions/viewing",
  },
  {
    title: "Filtering & Searching Transactions",
    description: "Find specific transactions quickly using filters and search",
    href: "/guides/transactions/filtering",
  },
  {
    title: "Bulk Editing Transactions",
    description: "Edit multiple transactions at once to save time",
    href: "/guides/transactions/bulk-editing",
  },
  {
    title: "Deleting Transactions",
    description: "Remove transactions you no longer need from your records",
    href: "/guides/transactions/deleting",
  },
];

export default function TransactionsOverviewPage() {
  return (
    <GuideLayout
      title="Transactions Overview"
      description="Learn everything about tracking your income and expenses"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-foreground leading-relaxed">
          Transactions are the foundation of your financial tracking. Whether
          it&apos;s recording a grocery purchase, logging your paycheck, or
          tracking a subscription payment, this section covers everything you
          need to know about managing transactions effectively.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {transactionGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {guide.description}
                        </p>
                      </div>
                      <ArrowRight className="ml-4 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Transaction Tracking Tips
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Record Immediately
                  </h3>
                  <p className="text-sm text-foreground">
                    Add transactions as soon as they happen. Don&apos;t wait
                    until the end of the day or week when details are forgotten.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Categorize Consistently
                  </h3>
                  <p className="text-sm text-foreground">
                    Use the same categories for similar purchases. This makes
                    reports and budgets more accurate over time.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Add Notes</h3>
                  <p className="text-sm text-foreground">
                    Include helpful details in notesâ€”who you were with, what the
                    purchase was for, or why you made it.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Review Weekly</h3>
                  <p className="text-sm text-foreground">
                    Check your transactions each week to catch errors early and
                    ensure nothing was missed.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Topics */}
        <Card className="bg-muted border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Related Topics
            </h2>
            <p className="text-muted-foreground mb-4">
              Explore related features to get the most out of transaction
              tracking
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/smart-input"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  Smart Input Features
                </h3>
                <p className="text-sm text-muted-foreground">
                  Voice input and receipt scanning
                </p>
              </Link>
              <Link
                href="/guides/budgets"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  Budget Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track spending against budgets
                </p>
              </Link>
              <Link
                href="/guides/reports"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  Reports & Analytics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analyze your transaction data
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
