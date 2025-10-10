import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function BulkEditingPage() {
  return (
    <GuideLayout
      title="Bulk Editing"
      description="Learn how to edit multiple transactions at once"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Bulk editing allows you to update multiple transactions
          simultaneously, saving time when you need to make the same changes
          across many transactions.
        </p>

        <GuideStep
          stepNumber={1}
          title="Open Bulk Edit Modal"
          image="/guides/transactions/transquickbuttons.png"
        >
          <p>
            On the Transactions page, click the{" "}
            <strong>&quot;Edit&quot;</strong> button in the Quick Actions card.
            This opens the Bulk Edit modal showing all currently filtered
            transactions.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Review Transactions to Edit"
          image="/guides/transactions/bulkedit.png"
          tip="Use filters before opening bulk edit to narrow down which transactions you want to modify."
        >
          <p>
            The modal displays all transactions from your current filter. Each
            transaction is shown in its own card with editable fields. You can
            edit as many or as few as you like.
          </p>
        </GuideStep>

        <GuideStep stepNumber={3} title="Update Individual Transactions">
          <p>For each transaction you want to modify, you can update:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Description:</strong> Change transaction descriptions
            </li>
            <li>
              <strong>Category:</strong> Assign different categories
            </li>
            <li>
              <strong>Status:</strong> Update transaction status
            </li>
            <li>
              <strong>Merchant/Source:</strong> Update party information
            </li>
            <li>
              <strong>Date:</strong> Adjust transaction dates
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={4} title="Scroll Through Transactions">
          <p>
            The modal has a scrollable area if you have many transactions.
            Scroll through the list to find and edit all transactions that need
            changes.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Save All Changes"
          warning="All changes are saved at once. Make sure you review all edits before saving."
        >
          <p>
            Once you&apos;ve finished editing, click the{" "}
            <strong>&quot;Save&quot;</strong> button at the bottom of the modal.
            All modified transactions will be updated simultaneously.
            You&apos;ll see a confirmation showing how many transactions were
            updated.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Click <strong>&quot;Cancel&quot;</strong> to discard all changes and
            close the modal.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">Best Practice</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Bulk editing is most useful when you need to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Recategorize multiple transactions from a specific merchant</li>
            <li>Update the status of several pending transactions at once</li>
            <li>Correct recurring typos across multiple transactions</li>
            <li>Adjust dates for imported transactions</li>
          </ul>
        </div>
      </div>
    </GuideLayout>
  );
}
