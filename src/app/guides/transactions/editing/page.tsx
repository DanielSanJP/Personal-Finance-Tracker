import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function EditingTransactionsPage() {
  return (
    <GuideLayout
      title="Editing Transactions"
      description="Learn how to update and modify transaction details"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          You can edit transaction details like description, category, status,
          and party information. Note that amount and type cannot be changed to
          maintain balance integrity.
        </p>

        <GuideStep
          stepNumber={1}
          title="Open Transaction Actions"
          image="/guides/transactions/transedit.png"
        >
          <p>
            On the Transactions page, find the transaction you want to edit.
            Click the <strong>three-dot menu icon</strong> (â‹®) in the Actions
            column of the transaction row to open the actions menu.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Select Edit Option"
          image="/guides/transactions/transeditview.png"
        >
          <p>
            From the dropdown menu, click <strong>&quot;Edit&quot;</strong>.
            This will open the Edit Transaction modal with the current
            transaction details.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Update Editable Fields"
          warning="Amount and Type are read-only fields. If you need to change these, delete the transaction and create a new one."
        >
          <p>In the edit modal, you can update:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Description:</strong> Change the transaction description
            </li>
            <li>
              <strong>Category:</strong> Select a different category
            </li>
            <li>
              <strong>Status:</strong> Update to Completed, Pending, Cancelled,
              or Failed
            </li>
            <li>
              <strong>Party:</strong> Update merchant (for expenses) or income
              source (for income)
            </li>
            <li>
              <strong>Date:</strong> Change when the transaction occurred
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={4} title="Read-Only Fields">
          <p>
            The <strong>Amount</strong> and <strong>Type</strong> fields are
            read-only and cannot be edited. These are locked to maintain the
            integrity of your account balances. If you need to change these
            values, delete the transaction and create a new one with the correct
            information.
          </p>
        </GuideStep>

        <GuideStep stepNumber={5} title="Save Your Changes">
          <p>
            After making your changes, click the{" "}
            <strong>&quot;Save&quot;</strong> button. You&apos;ll see a success
            notification and the transaction will be updated in the list.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Click <strong>&quot;Cancel&quot;</strong> or the X button to discard
            your changes and close the modal.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Use the Edit function to correct typos, update categories for better
            reporting, or change the status of pending transactions once they
            clear. This helps keep your financial records accurate without
            affecting your account balances.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
