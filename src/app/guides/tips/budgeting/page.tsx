import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function BudgetingBestPracticesGuide() {
  return (
    <GuideLayout
      title="Budgeting Best Practices"
      description="Tips for creating and maintaining effective budgets"
    >
      <GuideStep stepNumber={1} title="Start with Realistic Limits">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Base your budget limits on actual spending history, not aspirational
          goals:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Review past months&apos; spending in Reports to see real patterns
          </li>
          <li>Set initial budgets 10-15% above your average spending</li>
          <li>Gradually reduce limits as you build better spending habits</li>
          <li>Don&apos;t set limits so low that you constantly exceed them</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={2} title="Budget Every Major Category">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Create budgets for all significant spending categories:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Food & Dining (usually the largest expense)</li>
          <li>Transportation (gas, parking, public transit)</li>
          <li>Bills & Utilities (rent, electricity, internet)</li>
          <li>Entertainment (movies, hobbies, subscriptions)</li>
          <li>Shopping (clothing, household items)</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Missing categories lead to untracked spending that can derail your
          financial goals
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Review and Adjust Monthly">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Make budgeting a regular habit:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Review budget performance at the end of each month</li>
          <li>Look at the Yearly Spending Chart to identify trends</li>
          <li>
            Adjust limits for the upcoming month based on expected expenses
          </li>
          <li>
            Increase budgets for months with known extra costs (holidays,
            travel)
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={4} title="Use Budget Alerts Wisely">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Enable budget alerts in Preferences to stay informed:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Orange alerts at 80% give you time to slow spending</li>
          <li>Red alerts at 100% indicate you&apos;ve exceeded your limit</li>
          <li>Check the Budgets page regularly to see real-time status</li>
          <li>Act on warnings before they become problems</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={5} title="Plan for Variable Expenses">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Some categories vary significantly month-to-month:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Create separate budgets for variable categories (travel, gifts, home
            repairs)
          </li>
          <li>Use higher limits during peak months (December for gifts)</li>
          <li>
            Set aside &ldquo;buffer&rdquo; amounts in Other category for
            unexpected expenses
          </li>
          <li>Review yearly patterns to anticipate seasonal spending</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={6} title="The 50/30/20 Rule">
        <p className="text-muted-foreground leading-relaxed mb-3">
          A popular budgeting framework to consider:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">50% Needs:</strong> Bills,
            utilities, housing, groceries
          </li>
          <li>
            <strong className="text-foreground">30% Wants:</strong> Dining out,
            entertainment, hobbies
          </li>
          <li>
            <strong className="text-foreground">20% Savings:</strong> Emergency
            fund, goals, investments
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Use the Category Spending Breakdown pie chart to see if your
          distribution aligns with this rule
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Track Progress Over Time">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Use the Yearly Spending Chart to measure success:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Count how many months you stayed under budget</li>
          <li>
            Watch for improvement trends (more green bars, fewer red bars)
          </li>
          <li>
            Celebrate when you have more under-budget months than over-budget
          </li>
          <li>Use yearly totals to set goals for the following year</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
