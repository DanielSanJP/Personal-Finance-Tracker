import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  BarChart3,
  Target,
  TrendingUp,
  CreditCard,
  Mic,
  Lightbulb,
} from "lucide-react";

export default function OverviewPage() {
  return (
    <GuideLayout
      title="Introduction to Personal Finance Tracker"
      description="Learn what Personal Finance Tracker can do for you and how to get started"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Welcome to Personal Finance Tracker!
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Personal Finance Tracker is your comprehensive solution for managing
            your money. Whether you&apos;re trying to stick to a budget, save
            for a goal, or simply understand where your money goes, we&apos;ve
            got you covered.
          </p>
        </section>

        {/* What You Can Do */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            What You Can Do
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Track Transactions
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record income and expenses with detailed categorization. Use
                  voice input or receipt scanning for quick entry.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Manage Budgets
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create monthly budgets by category and track your spending
                  against them in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Set Financial Goals
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define savings goals and track your progress. Contribute
                  directly and watch your goals come to life.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  View Reports
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your financial data with charts and graphs. Export
                  reports for deeper analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Manage Accounts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track multiple bank accounts, credit cards, and cash accounts
                  all in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-3">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  Smart Features
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use voice commands to add transactions or scan receipts with
                  your camera for instant data entry.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How to Use These Guides */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            How to Use These Guides
          </h2>

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-6">
              <p className="text-foreground mb-4">
                These guides are organized by feature area. Each guide includes:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-bold">â€¢</span>
                  <span>
                    <strong className="text-foreground">
                      Step-by-step instructions
                    </strong>{" "}
                    with numbered steps
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">â€¢</span>
                  <span>
                    <strong className="text-foreground">Screenshots</strong>{" "}
                    showing exactly what to do
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">â€¢</span>
                  <span>
                    <strong className="text-foreground">Tips</strong> for
                    getting the most out of each feature
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">â€¢</span>
                  <span>
                    <strong className="text-foreground">Warnings</strong> about
                    common pitfalls to avoid
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <strong>Navigation Tip:</strong> Use the sidebar (or menu
                  button on mobile) to jump between guides. Use the
                  Previous/Next buttons at the bottom of each page to work
                  through guides in order.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-4">
            If you&apos;re new to Personal Finance Tracker, we recommend
            starting with the
            <strong className="text-foreground"> Getting Started</strong>{" "}
            section. This will walk you through:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4 mb-6">
            <li>Creating your account</li>
            <li>Understanding the dashboard</li>
            <li>Setting up your profile</li>
          </ol>
          <p className="text-muted-foreground">
            From there, you can explore specific features based on what you want
            to accomplish. Most users start by adding their accounts, then
            recording a few transactions to get comfortable with the interface.
          </p>
        </section>
      </div>
    </GuideLayout>
  );
}
