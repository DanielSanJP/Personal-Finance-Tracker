import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const gettingStartedGuides = [
  {
    title: "Creating Your Account",
    description: "Sign up and get started with Personal Finance Tracker",
    href: "/guides/getting-started/account",
  },
  {
    title: "Understanding the Dashboard",
    description: "Learn how to navigate and use the main dashboard",
    href: "/guides/getting-started/dashboard",
  },
  {
    title: "Setting Up Your Profile",
    description: "Customize your profile and preferences",
    href: "/guides/getting-started/profile",
  },
];

export default function GettingStartedOverviewPage() {
  return (
    <GuideLayout
      title="Getting Started Overview"
      description="Learn the basics and start tracking your finances"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Welcome to Personal Finance Tracker! This section will help you get up
          and running quickly. Learn how to create your account, navigate the
          dashboard, and set up your profile. Within minutes, you&apos;ll be
          ready to track transactions, create budgets, and manage your financial
          goals.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {gettingStartedGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-emerald-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {guide.description}
                        </p>
                      </div>
                      <ArrowRight className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Start */}
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
              <h2 className="text-2xl font-bold text-gray-900">
                Quick Start Guide
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Create Your Account
                  </h3>
                  <p className="text-sm text-gray-700">
                    Sign up with your email and create a secure password. It
                    takes less than a minute.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Add Your Bank Accounts
                  </h3>
                  <p className="text-sm text-gray-700">
                    Connect your checking, savings, and credit card accounts to
                    track everything in one place.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Start Tracking Transactions
                  </h3>
                  <p className="text-sm text-gray-700">
                    Add your first transaction manually, with voice input, or by
                    scanning a receipt.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Create Your First Budget
                  </h3>
                  <p className="text-sm text-gray-700">
                    Set spending limits for categories like groceries,
                    entertainment, and transportation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Topics */}
        <Card className="bg-gray-50 border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Next Steps
            </h2>
            <p className="text-gray-600 mb-4">
              After getting started, explore these features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/accounts"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Bank Accounts
                </h3>
                <p className="text-sm text-gray-600">
                  Add and manage all your accounts
                </p>
              </Link>
              <Link
                href="/guides/transactions"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Transactions
                </h3>
                <p className="text-sm text-gray-600">
                  Record and organize your spending
                </p>
              </Link>
              <Link
                href="/guides/budgets"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Budgets</h3>
                <p className="text-sm text-gray-600">
                  Create budgets to control spending
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
