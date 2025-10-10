import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tipsGuides = [
  {
    title: "Budgeting Best Practices",
    description: "Expert tips for creating and maintaining effective budgets",
    href: "/guides/tips/budgeting",
  },
  {
    title: "Goal Setting Strategies",
    description: "Set and achieve financial goals that actually work",
    href: "/guides/tips/goal-setting",
  },
  {
    title: "Organizing Transactions",
    description: "Keep your transaction history clean and organized",
    href: "/guides/tips/organizing",
  },
  {
    title: "Using Categories Effectively",
    description: "Categorize transactions for better insights and reporting",
    href: "/guides/tips/categories",
  },
];

export default function TipsOverviewPage() {
  return (
    <GuideLayout
      title="Tips & Best Practices Overview"
      description="Expert advice for mastering your personal finances"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Learn from financial experts and experienced users. These tips and
          best practices will help you get the most out of Personal Finance
          Tracker and build healthy money habits. Whether you&apos;re new to
          budgeting or looking to optimize your system, you&apos;ll find
          actionable advice here.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {tipsGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-yellow-200">
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

        {/* Core Principles */}
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
                Core Financial Principles
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
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Track Every Dollar
                  </h3>
                  <p className="text-sm text-gray-700">
                    You can&apos;t manage what you don&apos;t measure. Record
                    every transaction, no matter how small.
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
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Budget Before You Spend
                  </h3>
                  <p className="text-sm text-gray-700">
                    Plan your spending at the start of each month instead of
                    reacting to expenses after they happen.
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
                      d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Save First, Spend Later
                  </h3>
                  <p className="text-sm text-gray-700">
                    Treat savings like a bill—allocate money to savings goals
                    before spending on wants.
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
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Review Regularly
                  </h3>
                  <p className="text-sm text-gray-700">
                    Check your finances weekly and do a thorough monthly review
                    to stay on track and adjust as needed.
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
              Apply these tips to these key features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/budgets"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Budgets</h3>
                <p className="text-sm text-gray-600">
                  Create and maintain effective budgets
                </p>
              </Link>
              <Link
                href="/guides/goals"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Goals</h3>
                <p className="text-sm text-gray-600">
                  Set and achieve financial goals
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
                  Organize and track all spending
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
