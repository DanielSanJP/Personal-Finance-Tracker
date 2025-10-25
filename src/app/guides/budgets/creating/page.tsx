import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CreatingBudgetPage() {
  return (
    <GuideLayout
      title="Creating a Budget"
      description="Step-by-step guide to setting up your first budget"
    >
      <GuideStep
        stepNumber={1}
        title="Open the Budget Page"
        image="/guides/budgets/budgets.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Click on <strong className="text-foreground">Budgets</strong> in the
          main navigation menu. This will take you to your budgets overview
          where you can see all your existing budgets and create new ones.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Click Create New Budget"
        image="/guides/budgets/budgetcreatemodal.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Click the{" "}
          <strong className="text-foreground">Create New Budget</strong> button.
          This opens a dialog where you&apos;ll enter your budget details. If
          this is your first budget, you&apos;ll see this button prominently
          displayed on the page.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Select a Category"
        image="/guides/budgets/budgetcategories.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click the <strong className="text-foreground">Category</strong>{" "}
          dropdown and select the expense category you want to budget for.
          Common categories include:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Food and Dining - for food shopping, restaurants and takeout</li>
          <li>Transportation - for gas, public transit, and parking</li>
          <li>Entertainment - for movies, concerts, and hobbies</li>
          <li>Shopping - for clothing and general purchases</li>
          <li>Bills & Utilities - for recurring expenses</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You can only create one budget per category. If a category already has
          a budget, it will display as (Added).
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Enter Your Budget Amount"
        image="/guides/budgets/budgetamount.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          In the <strong className="text-foreground">Budget Amount</strong>{" "}
          field, enter how much you want to spend in this category during the
          selected period. For example:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>$150 for monthly Food and Dining</li>
          <li>$150 for monthly Transportation</li>
          <li>$100 for monthly Entertainment</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Choose an amount that&apos;s realistic based on your past spending.
          You can always adjust it later if needed.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={5}
        title="Choose a Budget Period"
        image="/guides/budgets/budgetperiod.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click the <strong className="text-foreground">Period</strong> dropdown
          and choose how long this budget should last:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Monthly</strong> - Budget runs
            from the 1st to the last day of each month (most common)
          </li>
          <li>
            <strong className="text-foreground">Weekly</strong> - Budget runs
            from Sunday to Saturday
          </li>
          <li>
            <strong className="text-foreground">Yearly</strong> - Budget runs
            from January 1st to December 31st
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Most people use monthly budgets as they align with pay periods and
          regular bills. The date range is automatically calculated based on
          your selection.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Review and Save">
        <p className="text-muted-foreground leading-relaxed">
          Review your budget details to make sure everything is correct. When
          ready, click the{" "}
          <strong className="text-foreground">Create Budget</strong> button.
          Your new budget will appear in your budget list and start tracking
          automatically as you add transactions in that category.
        </p>
      </GuideStep>

      <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
        <p className="text-sm text-muted-foreground">
          Start by creating budgets for your top 3-5 spending categories. This
          gives you the most impact without overwhelming yourself with too many
          budgets to track. You can always add more budgets as you become more
          comfortable with the system.
        </p>
      </div>
    </GuideLayout>
  );
}
