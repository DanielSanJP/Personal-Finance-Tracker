import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const budgetGuides = [
  {
    title: "Creating a Budget",
    description:
      "Set up budgets to control your spending in different categories",
    href: "/guides/budgets/creating",
  },
  {
    title: "Setting Budget Categories",
    description:
      "Organize your budgets by spending categories for better control",
    href: "/guides/budgets/categories",
  },
  {
    title: "Tracking Budget Progress",
    description: "Monitor your spending against budgets throughout the month",
    href: "/guides/budgets/tracking",
  },
  {
    title: "Editing Budgets",
    description: "Adjust your budget amounts and settings as your needs change",
    href: "/guides/budgets/editing",
  },
  {
    title: "Budget Alerts & Notifications",
    description: "Set up alerts to warn you when approaching budget limits",
    href: "/guides/budgets/alerts",
  },
];

export default function BudgetsOverviewPage() {
  return (
    <GuideLayout
      title="Budget Management Overview"
      description="Take control of your spending with effective budgeting"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Budgets are your roadmap to financial success. By setting spending
          limits for different categories, you can control your expenses, save
          more effectively, and reach your financial goals. This section will
          teach you how to create, monitor, and adjust budgets that work for
          your lifestyle.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {budgetGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-green-200">
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
              <h2 className="text-2xl font-bold text-gray-900">
                Budgeting Best Practices
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Start Conservative
                  </h3>
                  <p className="text-sm text-gray-700">
                    It&apos;s better to set slightly lower budgets at first and
                    adjust upward than to set high budgets and consistently
                    overspend.
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
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 002 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 002 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 002 0V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Review Past Spending
                  </h3>
                  <p className="text-sm text-gray-700">
                    Look at your spending reports from the past 2-3 months to
                    set realistic budget amounts.
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
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Use the 50/30/20 Rule
                  </h3>
                  <p className="text-sm text-gray-700">
                    Allocate 50% to needs, 30% to wants, and 20% to savings as a
                    starting framework.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Review Monthly</h3>
                  <p className="text-sm text-gray-700">
                    At the end of each month, review your performance and adjust
                    budgets for the next month.
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
              Related Topics
            </h2>
            <p className="text-gray-600 mb-4">
              Budgets work best when combined with these features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/transactions"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Transaction Tracking
                </h3>
                <p className="text-sm text-gray-600">
                  Record expenses to track against budgets
                </p>
              </Link>
              <Link
                href="/guides/reports"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Reports & Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Analyze budget performance over time
                </p>
              </Link>
              <Link
                href="/guides/goals"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Financial Goals
                </h3>
                <p className="text-sm text-gray-600">
                  Save money by staying within budget
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
