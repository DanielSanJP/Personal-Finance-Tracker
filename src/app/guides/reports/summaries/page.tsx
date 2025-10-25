import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function SummariesGuide() {
  return (
    <GuideLayout
      title="Monthly/Yearly Summaries"
      description="Understanding summary calculations and comparisons across time periods"
    >
      <GuideStep stepNumber={1} title="Monthly Summaries">
        <p className="text-muted-foreground leading-relaxed mb-3">
          View monthly spending summaries in the{" "}
          <strong className="text-foreground">
            Category Spending Breakdown
          </strong>{" "}
          pie chart:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Use the <strong className="text-foreground">Viewing:</strong>{" "}
            dropdown to select a month
          </li>
          <li>Shows category breakdown for that month</li>
          <li>Total spending displayed at bottom</li>
          <li>Available: Current month + last 11 months</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Yearly Summaries">
        <p className="text-muted-foreground leading-relaxed mb-3">
          View yearly spending summaries in the{" "}
          <strong className="text-foreground">Yearly Spending Chart</strong> bar
          chart:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Use the <strong className="text-foreground">Year:</strong> dropdown
            to select a year
          </li>
          <li>Shows all 12 months of spending</li>
          <li>
            Footer displays total spending, budget status, and month counts
          </li>
          <li>Available: Current year + last 4 years</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={3} title="How Totals Are Calculated">
        <p className="text-muted-foreground leading-relaxed mb-3">
          All summaries are calculated in real-time from your transaction data:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold text-foreground mb-1">
              Monthly Total
            </h4>
            <p className="text-sm text-muted-foreground">
              Sums all expense transactions for the selected month, grouped by
              category
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-foreground mb-1">Yearly Total</h4>
            <p className="text-sm text-muted-foreground">
              Sums spending for each of 12 months, compares to budget limits
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold text-foreground mb-1">
              Budget Status
            </h4>
            <p className="text-sm text-muted-foreground">
              ((Total Spending - Total Budget) / Total Budget) Ã— 100
            </p>
          </div>
        </div>
      </GuideStep>

      <GuideStep stepNumber={4} title="Comparing Periods">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To compare spending across different periods:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>Select one month/year and note the totals</li>
          <li>Select a different month/year to compare</li>
          <li>Look for patterns like seasonal spending or trends</li>
          <li>Compare category distributions in pie chart</li>
        </ol>
      </GuideStep>

      <GuideStep stepNumber={5} title="Using Summaries for Planning">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use summary data to make informed financial decisions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Identify trends:</strong> See if
            spending is increasing or decreasing
          </li>
          <li>
            <strong className="text-foreground">Set realistic budgets:</strong>{" "}
            Base limits on past actual spending
          </li>
          <li>
            <strong className="text-foreground">
              Plan for seasonal expenses:
            </strong>{" "}
            Compare same month across years
          </li>
          <li>
            <strong className="text-foreground">Track financial goals:</strong>{" "}
            Monitor yearly totals
          </li>
          <li>
            <strong className="text-foreground">Prepare for taxes:</strong>{" "}
            Quick yearly spending reference
          </li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
