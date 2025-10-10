import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function EditingBudgetsPage() {
  return (
    <GuideLayout
      title="Editing Budgets"
      description="Learn how to update your budget amounts, categories, and periods"
    >
      <GuideStep
        stepNumber={1}
        title="Open the Budgets Page"
        image="/guides/budgets/budgets.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Navigate to the <strong className="text-foreground">Budgets</strong>{" "}
          page from the main navigation menu. You&apos;ll see all your existing
          budgets displayed as cards with their current progress.
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Locate the Budget to Edit">
        <p className="text-muted-foreground leading-relaxed">
          Find the budget card for the category you want to modify. Each card
          shows the category name, budget amount, amount spent, and a progress
          bar. Budget cards are organized by category for easy identification.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Click Edit Budgets"
        image="/guides/budgets/editbudgets.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          In the <strong className="text-foreground">Quick Actions</strong> card
          at the top of the page, click the{" "}
          <strong className="text-foreground">Edit Budgets</strong> button. This
          opens a dialog showing all your budgets in one place for easy editing.
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="View All Your Budgets">
        <p className="text-muted-foreground leading-relaxed mb-3">
          The dialog displays all your budgets in a scrollable list. For each
          budget, you&apos;ll see:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Category name at the top</li>
          <li>Budget Amount input field</li>
          <li>Current spending amount below the field</li>
          <li>Delete button (trash icon) in the top-right corner</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This layout lets you edit multiple budgets at once without opening
          separate dialogs for each one.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Update Budget Amounts">
        <p className="text-muted-foreground leading-relaxed mb-3">
          To change a budget amount:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>Find the budget you want to modify</li>
          <li>
            Click in the{" "}
            <strong className="text-foreground">Budget Amount</strong> field
          </li>
          <li>Enter the new amount</li>
          <li>Repeat for any other budgets you want to change</li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The current spending amount shown below each field helps you decide if
          your new budget amount is realistic. You can edit multiple budgets
          before saving.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Delete a Budget (Optional)">
        <p className="text-muted-foreground leading-relaxed mb-3">
          If you want to remove a budget entirely:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
          <li>
            Click the <strong className="text-foreground">trash icon</strong> in
            the top-right corner of the budget you want to delete
          </li>
          <li>A confirmation dialog will appear</li>
          <li>
            Click <strong className="text-foreground">Delete Budget</strong> to
            confirm
          </li>
        </ol>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Deleted budgets cannot be recovered, but you can always create a new
          budget for that category again later.
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Save All Changes">
        <p className="text-muted-foreground leading-relaxed">
          After making all your edits, click the{" "}
          <strong className="text-foreground">Save All Changes</strong> button
          at the bottom of the dialog. All modified budgets will be updated at
          once, and the progress bars will recalculate based on the new amounts.
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">
            When to Edit Your Budget
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>You consistently go over</strong> - Increase the budget
              amount to a more realistic level
            </li>
            <li>
              • <strong>You have money left over every month</strong> - Decrease
              the budget and reallocate to savings or other categories
            </li>
            <li>
              • <strong>Your spending patterns change</strong> - Adjust
              categories or amounts to match your current lifestyle
            </li>
            <li>
              • <strong>You want to try a different time period</strong> -
              Switch from monthly to weekly or yearly tracking
            </li>
          </ul>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">Important Note</h3>
          <p className="text-sm text-amber-800">
            When you change the budget amount, the amount you&apos;ve already
            spent doesn&apos;t change - only the progress percentage
            recalculates. For example, if you&apos;ve spent $400 of a $500
            budget (80%) and change it to $800, you&apos;ll now be at 50% ($400
            of $800).
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
