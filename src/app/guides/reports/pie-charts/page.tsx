import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function PieChartsGuide() {
  return (
    <GuideLayout
      title="Pie Charts & Breakdowns"
      description="Understand how spending is distributed across categories"
    >
      <GuideStep
        stepNumber={1}
        title="Category Pie Chart"
        image="/guides/reports/piechart.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The{" "}
          <strong className="text-foreground">
            Category Spending Breakdown
          </strong>{" "}
          pie chart shows how your spending is distributed across different
          expense categories. Each slice represents one category.
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Slice size is proportional to spending amount</li>
          <li>Only categories with spending &gt; $0 appear</li>
          <li>Different blue shades for each category</li>
        </ul>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Month Selector"
        image="/guides/reports/monthselect.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the <strong className="text-foreground">Viewing:</strong> dropdown
          below the chart title to select different months. Current month is
          marked with a blue{" "}
          <strong className="text-foreground">&ldquo;Current&rdquo;</strong>{" "}
          badge.
        </p>
        <p className="text-sm text-muted-foreground">
          Available: Current month + last 11 months (12 months total)
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Category Colors">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Each category uses a distinct blue shade:
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#3b82f6" }}
            ></div>
            <span className="text-muted-foreground">Food & Dining</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#60a5fa" }}
            ></div>
            <span className="text-muted-foreground">Transportation</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#1d4ed8" }}
            ></div>
            <span className="text-muted-foreground">Shopping</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#93c5fd" }}
            ></div>
            <span className="text-muted-foreground">Entertainment</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#1e40af" }}
            ></div>
            <span className="text-muted-foreground">Bills & Utilities</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: "#6b7280" }}
            ></div>
            <span className="text-muted-foreground">Other</span>
          </div>
        </div>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Interactive Tooltips"
        image="/guides/reports/pietooltip.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Hover over any slice to see a tooltip with the category name and exact
          dollar amount spent.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={5}
        title="Total Spending"
        image="/guides/reports/piesummary.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The chart footer displays:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Total spending:</strong> Sum of
            all categories
          </li>
          <li>
            <strong className="text-foreground">Time period:</strong>{" "}
            &ldquo;Current month spending by category&rdquo; or specific month
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={6} title="Analyzing Breakdown">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the pie chart to identify spending patterns:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Largest slices show which categories consume most of your budget
          </li>
          <li>Compare month-to-month to see how patterns change</li>
          <li>Identify overspending in specific categories</li>
          <li>Plan budget adjustments for high-spending categories</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
