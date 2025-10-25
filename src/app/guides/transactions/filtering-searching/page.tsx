import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function FilteringSearchingPage() {
  return (
    <GuideLayout
      title="Filtering & Searching"
      description="Learn how to find and filter transactions efficiently"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Powerful filtering and sorting options help you find specific
          transactions and analyze your spending patterns. All filters work
          together to narrow down your transaction list.
        </p>

        <GuideStep
          stepNumber={1}
          title="Filter by Category"
          image="/guides/transactions/filtercategory.png"
        >
          <p>
            Use the <strong>Category</strong> dropdown to filter transactions by
            category. Select a specific category (e.g., Groceries, Dining,
            Transportation) or choose &quot;All Categories&quot; to see
            everything.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Only categories that exist in your transactions will appear in the
            list.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Filter by Time Period"
          image="/guides/transactions/filtertime.png"
          tip="'This Month' is the default view to help you focus on current spending."
        >
          <p>
            Use the <strong>Period</strong> dropdown to filter by date range:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>This Month:</strong> Current month only
            </li>
            <li>
              <strong>Last Month:</strong> Previous month
            </li>
            <li>
              <strong>Last 3 Months:</strong> Past three months
            </li>
            <li>
              <strong>This Year:</strong> Current calendar year
            </li>
            <li>
              <strong>All Time:</strong> Every transaction
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Filter by Party"
          image="/guides/transactions/filterparty.png"
        >
          <p>
            The <strong>Party</strong> dropdown shows merchants (for expenses),
            income sources (for income), and transfer destinations. Each party
            displays the total amount:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>(-$100.00):</strong> (Money out)
            </li>
            <li>
              <strong>(+$500.00):</strong> (Money in)
            </li>
            <li>
              <strong>(â†’$200.00):</strong> Arrow for transfers
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Parties are automatically extracted from your transactions and
            sorted by amount.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Filter by Type"
          image="/guides/transactions/filtertype.png"
        >
          <p>
            Use the <strong>Type</strong> dropdown to show only specific
            transaction types:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Expense:</strong> Money spent
            </li>
            <li>
              <strong>Income:</strong> Money received
            </li>
            <li>
              <strong>Transfer:</strong> Money moved between accounts or to
              goals
            </li>
            <li>
              <strong>All Types:</strong> Show everything
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Combine Multiple Filters"
          image="/guides/transactions/filterall.png"
          tip="Filters work together - select Category, Period, Party, and Type to narrow down to exactly what you're looking for."
        >
          <p>
            Use multiple filters simultaneously for precise results. For
            example:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              Category: Groceries + Period: This Month = This month&apos;s
              grocery spending
            </li>
            <li>
              Type: Expense + Party: Specific Store = All purchases from that
              store
            </li>
            <li>Category: Salary + Period: This Year = Annual salary income</li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={6}
          title="Sort Transactions"
          image="/guides/transactions/filtersort.png"
        >
          <p>
            Use the <strong>Sort</strong> dropdown to change the order of
            transactions:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Date:</strong> Most recent first (default) or oldest first
            </li>
            <li>
              <strong>Amount:</strong> Highest to lowest or lowest to highest
            </li>
            <li>
              <strong>Name:</strong> Alphabetically by party name
            </li>
            <li>
              <strong>None:</strong> Default database order
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Toggle between ascending and descending order using the sort
            direction button.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={7}
          title="View Transaction Summary"
          image="/guides/transactions/filtersummary.png"
        >
          <p>
            The summary card at the top shows statistics for your filtered
            results:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Total number of transactions</li>
            <li>Total expenses (in red)</li>
            <li>Total income (in green)</li>
            <li>Net change (income minus expenses)</li>
          </ul>
        </GuideStep>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Filters are immediately applied as you change them - no need to
            click a search button. The party filter automatically updates based
            on your other filter selections, making it easy to drill down into
            specific spending patterns.
          </p>
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Exporting Filtered Data
          </h3>
          <p className="text-sm text-muted-foreground">
            Use the <strong>&quot;Export to CSV&quot;</strong> or{" "}
            <strong>&quot;Export to PDF&quot;</strong> buttons to download your
            currently filtered transactions. This is perfect for creating
            reports or importing data into other tools.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
