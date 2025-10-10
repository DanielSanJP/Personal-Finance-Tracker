import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function TransactionDetailsPage() {
  return (
    <GuideLayout
      title="Viewing Transaction Details"
      description="Learn how to view complete information about a transaction"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          The transaction detail view shows all information about a specific
          transaction including parties involved, timestamps, and unique
          identifiers.
        </p>

        <GuideStep stepNumber={1} title="Click on a Transaction">
          <p>
            On the Transactions page, click anywhere on a transaction row to
            view its details. This opens the Transaction Details modal.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="View Basic Information"
          image="/guides/transactions/transactiondetails.png"
        >
          <p>The detail view displays the following information:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Description:</strong> What the transaction was for
            </li>
            <li>
              <strong>Amount:</strong> Transaction amount with color coding
              (green for income, red for expenses)
            </li>
            <li>
              <strong>Type:</strong> Transaction type (Expense, Income, or
              Transfer)
            </li>
            <li>
              <strong>Category:</strong> Assigned category
            </li>
            <li>
              <strong>Status:</strong> Current status (Completed, Pending, etc.)
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={3} title="Check Party Information">
          <p>See who was involved in the transaction:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>From:</strong> Where the money came from (account name for
              expenses, income source for income)
            </li>
            <li>
              <strong>To:</strong> Where the money went (merchant for expenses,
              account name for income, goal name for goal contributions)
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={4} title="View Date and Time">
          <p>
            The detail view shows the complete date and time of the transaction
            in a readable format, including the day of the week, full date, and
            exact time (e.g., &quot;Monday, December 25, 2023, 2:30 PM&quot;).
          </p>
        </GuideStep>

        <GuideStep stepNumber={5} title="Transaction ID">
          <p>
            At the bottom of the detail view, you&apos;ll find the unique
            Transaction ID. This is useful for:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Support inquiries and troubleshooting</li>
            <li>Referencing specific transactions in reports</li>
            <li>Tracking transactions across systems</li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={6} title="Close the Detail View">
          <p>
            Click the <strong>&quot;Close&quot;</strong> button at the bottom of
            the modal or the X in the top right corner to return to the
            transaction list.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Quick Navigation
          </h3>
          <p className="text-sm text-muted-foreground">
            You can also access transaction actions (Edit, Delete) from the
            three-dot menu in the Actions column without opening the detail
            view. Use the detail view when you want to see all information at a
            glance or need to copy the Transaction ID.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
