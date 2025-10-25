import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function TrackingBudgetProgressPage() {
  return (
    <GuideLayout
      title="Tracking Budget Progress"
      description="Monitor your spending and stay on track with visual progress indicators"
    >
      <GuideStep stepNumber={1} title="Viewing Your Budgets">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Navigate to the <strong className="text-foreground">Budgets</strong>{" "}
          page from the main navigation menu. Here you&apos;ll see all your
          active budgets displayed as cards, each showing:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Category name and icon</li>
          <li>Budget amount for the period</li>
          <li>Amount spent so far</li>
          <li>Visual progress bar</li>
          <li>Percentage of budget used</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Understanding Progress Bars">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Each budget has a progress bar that fills up as you spend. The bar
          uses color coding to show your status:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-muted border flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Gray (Under 80%)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re doing well and have plenty of budget left
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-orange-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Orange (80-100%)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;re approaching your limit - be careful with additional
                spending
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-3 w-16 rounded bg-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Red (Over 100%)
              </p>
              <p className="text-sm text-muted-foreground">
                You&apos;ve exceeded your budget limit
              </p>
            </div>
          </div>
        </div>
      </GuideStep>

      <GuideStep stepNumber={3} title="Reading Spending Details">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Below each progress bar, you&apos;ll see detailed spending
          information:
        </p>
        <div className="space-y-2 text-muted-foreground ml-4">
          <p>
            <strong className="text-foreground">$450 of $500</strong> - Shows
            how much you&apos;ve spent ($450) out of your total budget ($500)
          </p>
          <p>
            <strong className="text-foreground">90% used</strong> - The
            percentage of your budget that&apos;s been spent
          </p>
          <p>
            <strong className="text-foreground">$50 remaining</strong> - How
            much you have left to spend before hitting your limit
          </p>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          These numbers update automatically every time you add, edit, or delete
          a transaction in that category.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Automatic Tracking">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The system automatically tracks your spending for you. When you add a
          transaction:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            The transaction amount is added to the category&apos;s spent total
          </li>
          <li>The progress bar updates to reflect the new spending</li>
          <li>The percentage and remaining amount are recalculated</li>
          <li>The progress bar color may change based on the new percentage</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You don&apos;t need to do anything manually - just add your
          transactions normally and your budgets update automatically.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Checking Budget Summary">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The budget summary section shows your overall budget health:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Total budgeted</strong> - Sum of
            all your budget amounts
          </li>
          <li>
            <strong className="text-foreground">Total spent</strong> - Sum of
            all spending across budgeted categories
          </li>
          <li>
            <strong className="text-foreground">On track</strong> - Number of
            budgets within their limits
          </li>
          <li>
            <strong className="text-foreground">Over budget</strong> - Number of
            budgets that have exceeded their limits
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Use this summary to get a quick overview of how well you&apos;re
          managing your overall spending.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Budget Period Tracking">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Budgets track spending within their specific period:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Monthly budgets</strong> - Reset
            on the 1st of each month. Only transactions from the current month
            count toward the budget.
          </li>
          <li>
            <strong className="text-foreground">Weekly budgets</strong> - Reset
            every Sunday. Only transactions from the current week (Sunday-
            Saturday) are tracked.
          </li>
          <li>
            <strong className="text-foreground">Yearly budgets</strong> - Reset
            on January 1st. All transactions from the current year are included.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Transactions from outside the budget period don&apos;t affect the
          current period&apos;s tracking, even if they&apos;re in the same
          category.
        </p>
      </GuideStep>

      <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Check your budgets regularly throughout the month, not just at the
          end. When a progress bar turns orange (80%), it&apos;s time to slow
          down spending in that category to stay under budget.
        </p>
        <p className="text-sm text-muted-foreground">
          Set a reminder to review your budgets weekly so you can adjust your
          spending behavior before you go over budget.
        </p>
      </div>
    </GuideLayout>
  );
}
