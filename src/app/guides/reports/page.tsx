import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const reportsGuides = [
  {
    title: "Viewing Financial Reports",
    description: "Access and understand your financial reports and analytics",
    href: "/guides/reports/viewing",
  },
  {
    title: "Understanding Charts",
    description: "Learn how to read and interpret different chart types",
    href: "/guides/reports/charts",
  },
  {
    title: "Pie Charts & Breakdowns",
    description: "Visualize spending by category with pie charts",
    href: "/guides/reports/pie-charts",
  },
  {
    title: "Exporting Reports",
    description: "Download your financial data for external use",
    href: "/guides/reports/exporting",
  },
  {
    title: "Monthly/Yearly Summaries",
    description: "Review comprehensive summaries of your finances over time",
    href: "/guides/reports/summaries",
  },
];

export default function ReportsOverviewPage() {
  return (
    <GuideLayout
      title="Reports & Analytics Overview"
      description="Gain insights into your financial habits with powerful reports"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-foreground leading-relaxed">
          Reports and analytics transform your transaction data into actionable
          insights. Visualize spending patterns, identify trends, and make
          informed decisions about your finances. Whether you need a quick
          overview or deep analysis, our reporting tools have you covered.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {reportsGuides.map((guide) => (
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
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Getting the Most from Reports
            </h2>
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
                    Review Regularly
                  </h3>
                  <p className="text-sm text-foreground">
                    Check your reports weekly or monthly to spot trends early
                    and adjust your budget before overspending.
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
                    Compare Periods
                  </h3>
                  <p className="text-sm text-foreground">
                    Look at month-over-month or year-over-year comparisons to
                    understand if you&apos;re improving your finances.
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
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Focus on Categories
                  </h3>
                  <p className="text-sm text-foreground">
                    Use category breakdowns to identify where most of your money
                    goes and find opportunities to save.
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
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Export Data</h3>
                  <p className="text-sm text-foreground">
                    Download reports for tax preparation, budget planning, or
                    sharing with financial advisors.
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
              Reports work best when combined with these features
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
                  Reports analyze your transaction history
                </p>
              </Link>
              <Link
                href="/guides/budgets"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">Budgets</h3>
                <p className="text-sm text-muted-foreground">
                  Compare spending against budget limits
                </p>
              </Link>
              <Link
                href="/guides/goals"
                className="p-4 bg-card rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-foreground mb-1">Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Track progress toward financial goals
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
