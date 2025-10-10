import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const goalsGuides = [
  {
    title: "Creating a Financial Goal",
    description:
      "Set up savings goals to track progress toward major purchases",
    href: "/guides/goals/creating",
  },
  {
    title: "Contributing to Goals",
    description: "Add money to your goals and track your progress",
    href: "/guides/goals/contributing",
  },
  {
    title: "Tracking Goal Progress",
    description: "Monitor how close you are to reaching your savings targets",
    href: "/guides/goals/tracking",
  },
  {
    title: "Editing Goals",
    description: "Update your goal amounts, dates, and other details",
    href: "/guides/goals/editing",
  },
  {
    title: "Completing Goals",
    description: "Mark goals as complete and celebrate your achievements",
    href: "/guides/goals/completing",
  },
];

export default function GoalsOverviewPage() {
  return (
    <GuideLayout
      title="Financial Goals Overview"
      description="Save for what matters most with goal tracking"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Financial goals help you save for the things that matter most—whether
          it&apos;s a vacation, emergency fund, down payment, or dream purchase.
          Set clear targets, track your progress, and stay motivated as you work
          toward your objectives.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {goalsGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-200">
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
                Goal Setting Tips
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
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Be Specific</h3>
                  <p className="text-sm text-gray-700">
                    Set clear, measurable goals with exact amounts and
                    deadlines. &quot;Save $5,000 for vacation by July&quot; is
                    better than &quot;save money.&quot;
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
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Start Small</h3>
                  <p className="text-sm text-gray-700">
                    Begin with achievable goals to build momentum. You can
                    always create bigger goals once you&apos;ve had success.
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
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Contribute Regularly
                  </h3>
                  <p className="text-sm text-gray-700">
                    Make consistent contributions to your goals each month. Set
                    a reminder to add money regularly, just like paying a bill.
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
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                  <p className="text-sm text-gray-700">
                    Check your goal progress regularly to stay motivated and
                    adjust your contributions if needed.
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
              Goals work best when combined with these features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/budgets"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Budgets</h3>
                <p className="text-sm text-gray-600">
                  Free up money by sticking to your budget
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
                  Track income to allocate toward goals
                </p>
              </Link>
              <Link
                href="/guides/reports"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
                <p className="text-sm text-gray-600">
                  Analyze savings patterns and trends
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
