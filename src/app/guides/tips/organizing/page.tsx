import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function OrganizingTransactionsGuide() {
  return (
    <GuideLayout
      title="Organizing Transactions"
      description="Best practices for keeping your transactions organized and easy to find"
    >
      <GuideStep stepNumber={1} title="Use Descriptive Names">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Write clear, specific transaction descriptions:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">âŒ Unclear:</strong>{" "}
              &ldquo;Store&rdquo;, &ldquo;Food&rdquo;, &ldquo;Stuff&rdquo;
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm">
              <strong className="text-foreground">âœ… Clear:</strong>{" "}
              &ldquo;Safeway groceries&rdquo;, &ldquo;Netflix
              subscription&rdquo;, &ldquo;Gas at Shell&rdquo;
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Good descriptions help you remember purchases when reviewing months
          later
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Categorize Immediately">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Assign the correct category when creating transactions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Don&apos;t leave transactions uncategorized</li>
          <li>Choose the most specific category that applies</li>
          <li>
            When uncertain, use{" "}
            <strong className="text-foreground">Other</strong> temporarily
          </li>
          <li>Review and recategorize Other transactions weekly</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Accurate categories ensure your reports and budgets reflect reality
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Enter Transactions Promptly">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Add transactions as soon as possible after purchases:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Enter immediately after purchase while details are fresh</li>
          <li>Use voice input or receipt scan for quick entry</li>
          <li>Set a daily reminder to enter any missed transactions</li>
          <li>
            Don&apos;t wait until end of month - you&apos;ll forget details
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={4} title="Use Search Effectively">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Find transactions quickly using search features:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Use the search box to find by description, amount, or merchant
          </li>
          <li>Filter by category to see all Food & Dining transactions</li>
          <li>Sort by date, amount, or category</li>
          <li>Use date range filters for specific time periods</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={5} title="Review Regularly">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Set a regular schedule for transaction review:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Daily:</strong> Quick 2-minute
            check that today&apos;s transactions are entered
          </li>
          <li>
            <strong className="text-foreground">Weekly:</strong> Review all
            transactions, fix any errors or miscategorizations
          </li>
          <li>
            <strong className="text-foreground">Monthly:</strong> Export to
            CSV/PDF for permanent records
          </li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={6} title="Edit When Needed">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Don&apos;t hesitate to fix incorrect transactions:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Use Edit Transactions to update multiple at once</li>
          <li>Fix wrong amounts, categories, or dates immediately</li>
          <li>Update descriptions to make them more specific</li>
          <li>Delete duplicate transactions</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Accurate data is essential for meaningful budgets and reports
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Reconcile with Bank Statements">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Match your tracked transactions with actual bank statements:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Compare monthly totals with your bank statement</li>
          <li>Look for missing transactions you forgot to enter</li>
          <li>Identify duplicate entries</li>
          <li>Investigate any significant discrepancies</li>
        </ul>
      </GuideStep>
    </GuideLayout>
  );
}
