import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function UnderstandingChartsGuide() {
  return (
    <GuideLayout
      title="Understanding Charts"
      description="Learn how to read and interpret the bar chart visualization"
    >
      <GuideStep
        stepNumber={1}
        title="Yearly Bar Chart Overview"
        image="/guides/reports/barchart.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The Yearly Spending Chart shows monthly spending throughout the year
          with 12 bars (one per month).
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>X-axis shows month names (Jan, Feb, Mar, etc.)</li>
          <li>Y-axis shows dollar amounts</li>
          <li>Dashed line indicates max budget limit</li>
        </ul>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Year Selector"
        image="/guides/reports/yearselect.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the <strong className="text-foreground">Year:</strong> dropdown in
          the top right to view different years. The current year is marked with
          a blue{" "}
          <strong className="text-foreground">&ldquo;Current&rdquo;</strong>{" "}
          badge.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Available: Current year + previous 4 years
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Bar Colors Meaning"
        image="/guides/reports/barchartlimits.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Bar colors indicate budget status:
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#10b981" }}
            ></div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">Green</strong> - Under budget
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#f97316" }}
            ></div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">Orange</strong> - Close to
              budget (80-100%)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "#ef4444" }}
            ></div>
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">Red</strong> - Over budget
            </span>
          </div>
        </div>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Budget Reference Line"
        image="/guides/reports/barchartlimits.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          The dashed horizontal line shows your maximum budget limit. Bars
          extending above this line indicate over-budget spending for that
          month. The max budget value also appears in the top right corner.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={5}
        title="Interactive Tooltips"
        image="/guides/reports/barcharttooltip.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Hover over any bar to see a tooltip with exact spending amount and
          budget limit for that month.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={6}
        title="Chart Summary"
        image="/guides/reports/barsummary.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The footer displays key insights:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Budget Status:</strong>{" "}
            Percentage over or under budget with icon (red trending up or green
            trending down)
          </li>
          <li>
            <strong className="text-foreground">Monthly Summary:</strong> Count
            of months under budget vs. over budget
          </li>
          <li>
            <strong className="text-foreground">Total Spending:</strong> Sum of
            all 12 months (top right)
          </li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
