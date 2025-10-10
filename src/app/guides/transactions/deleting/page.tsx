import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function DeletingTransactionsPage() {
  return (
    <GuideLayout
      title="Deleting Transactions"
      description="Learn how to remove transactions from your records"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Deleting a transaction permanently removes it from your records and
          adjusts your account balance accordingly. Use this feature carefully
          as deletions cannot be undone.
        </p>

        <GuideStep stepNumber={1} title="Locate the Transaction">
          <p>
            On the Transactions page, find the transaction you want to delete.
            You can use filters to narrow down the list if needed.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Open Transaction Actions"
          image="/guides/transactions/transedit.png"
        >
          <p>
            Click the <strong>three-dot menu icon</strong> (⋮) in the Actions
            column of the transaction row. This opens a dropdown menu with
            available actions.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Select Delete Option"
          warning="Deletion is permanent and cannot be undone. Make sure you're deleting the correct transaction."
        >
          <p>
            From the dropdown menu, click the{" "}
            <strong>&quot;Delete&quot;</strong> option. The transaction will be
            immediately deleted from your records.
          </p>
        </GuideStep>

        <GuideStep stepNumber={4} title="Balance Adjustment">
          <p>After deletion, your account balance is automatically adjusted:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Deleted Expense:</strong> Your account balance increases
              (as if the expense never happened)
            </li>
            <li>
              <strong>Deleted Income:</strong> Your account balance decreases
              (as if the income never happened)
            </li>
            <li>
              <strong>Deleted Transfer:</strong> Both accounts are adjusted
              accordingly
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={5} title="Confirmation Notification">
          <p>
            You&apos;ll see a success notification confirming the transaction
            has been deleted. The transaction will no longer appear in your
            transaction list or affect your reports.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            When to Delete vs. Edit
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Consider these guidelines:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>Delete:</strong> Duplicate transactions, test entries, or
              transactions entered by mistake
            </li>
            <li>
              <strong>Edit:</strong> Correct typos, update categories, or change
              descriptions
            </li>
            <li>
              <strong>Set to Cancelled:</strong> For transactions that were
              attempted but didn&apos;t complete
            </li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Important Note</h3>
          <p className="text-sm text-muted-foreground">
            Guest accounts cannot delete transactions. If you&apos;re using a
            guest account, you&apos;ll see a notification explaining this
            limitation. Create a full account to enable all features including
            transaction deletion.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
