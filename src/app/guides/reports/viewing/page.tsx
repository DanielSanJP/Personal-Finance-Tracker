import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function ViewingReportsGuide() {
  return (
    <GuideLayout
      title="Viewing Financial Reports"
      description="Learn how to access and view your financial reports"
    >
      <GuideStep
        stepNumber={1}
        title="Navigate to Reports"
        image="/guides/reports/navigate.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click on <strong className="text-foreground">Reports</strong> in the
          main navigation menu to access your financial analytics.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Two Main Charts"
        image="/guides/reports/pie.png"
        additionalImage="/guides/reports/barchart.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The Reports page displays two visualization charts:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">
              Category Spending Breakdown
            </strong>{" "}
            - Pie chart showing spending distribution across categories
          </li>
          <li>
            <strong className="text-foreground">Yearly Spending Chart</strong> -
            Bar chart showing monthly spending vs. budget limits
          </li>
        </ul>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Interactive Features"
        image="/guides/reports/pietooltip.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Both charts are interactive:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Hover over chart elements to see detailed tooltips</li>
          <li>Use dropdown selectors to view different time periods</li>
          <li>Pie chart: Current month + last 11 months</li>
          <li>Bar chart: Current year + last 4 years</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
