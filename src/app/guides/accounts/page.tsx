import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const accountsGuides = [
  {
    title: "Adding a New Account",
    description: "Connect your bank accounts to track all your finances",
    href: "/guides/accounts/adding",
  },
  {
    title: "Viewing Account Details",
    description: "Check balances and see transactions for each account",
    href: "/guides/accounts/viewing",
  },
  {
    title: "Editing Account Information",
    description: "Update account names, balances, and other details",
    href: "/guides/accounts/editing",
  },
  {
    title: "Managing Multiple Accounts",
    description: "Organize and switch between multiple bank accounts",
    href: "/guides/accounts/managing",
  },
];

export default function AccountsOverviewPage() {
  return (
    <GuideLayout
      title="Bank Accounts Overview"
      description="Manage all your accounts in one place"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-foreground leading-relaxed">
          Bank accounts are the foundation of your financial tracking. Add all
          your checking, savings, and credit card accounts to get a complete
          picture of your finances. Track balances, monitor transactions, and
          stay on top of your money across all your accounts.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {accountsGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-teal-200">
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
                Account Management Tips
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
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Add All Accounts
                  </h3>
                  <p className="text-sm text-foreground">
                    Include checking, savings, credit cards, and any other
                    accounts you use regularly for a complete financial picture.
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
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Update Balances Regularly
                  </h3>
                  <p className="text-sm text-foreground">
                    Keep your account balances current by updating them weekly
                    or after major transactions.
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
                  <h3 className="font-semibold text-lg mb-2">
                    Use Clear Names
                  </h3>
                  <p className="text-sm text-foreground">
                    Name your accounts clearly (e.g., &quot;Chase
                    Checking&quot;, &quot;Emergency Savings&quot;) so you can
                    quickly identify them.
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
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Track Different Types
                  </h3>
                  <p className="text-sm text-foreground">
                    Separate accounts by type (checking, savings, credit) to
                    better understand where your money is held.
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
              Accounts work best when combined with these features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/transactions"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">
                  Transactions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record transactions for each account
                </p>
              </Link>
              <Link
                href="/guides/getting-started/dashboard"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  View all account balances at a glance
                </p>
              </Link>
              <Link
                href="/guides/reports"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze spending across all accounts
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
