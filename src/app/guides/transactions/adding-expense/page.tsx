import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function AddingExpensePage() {
  return (
    <GuideLayout
      title="Adding an Expense"
      description="Learn how to record expense transactions in Personal Finance Tracker"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Recording expenses helps you track where your money goes and maintain
          accurate account balances. You can add expenses manually, use voice
          input, or scan receipts.
        </p>

        <GuideStep
          stepNumber={1}
          title="Fill in Required Fields"
          image="/guides/transactions/expenseform.png"
        >
          <p>Complete all required fields marked with an asterisk (*):</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Amount:</strong> Enter the expense amount as a positive
              number (e.g., 45.99)
            </li>
            <li>
              <strong>Description:</strong> Brief description of the expense
              (e.g., &quot;Grocery shopping&quot;)
            </li>
            <li>
              <strong>Paid To:</strong> Name of the merchant or person (e.g.,
              &quot;Walmart&quot;)
            </li>
            <li>
              <strong>Account:</strong> Select which account this expense is
              from
            </li>
            <li>
              <strong>Date:</strong> When the transaction occurred (defaults to
              today)
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Add Optional Details"
          image="/guides/transactions/expensecategory.png"
        >
          <p>Enhance your expense tracking with optional information:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Category:</strong> Categorize the expense (e.g., Food and
              Dining, Transportation, Housing)
            </li>
            <li>
              <strong>Status:</strong> Transaction status - Completed (default),
              Pending, Cancelled, or Failed
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Use Voice Input (Optional)"
          image="/guides/transactions/voiceinputexpense.png"
          tip="Speak naturally: 'I spent forty-five dollars at Walmart for groceries today'"
        >
          <p>
            Click the <strong>&quot;Voice Input&quot;</strong> button to speak
            your transaction instead of typing. The system will automatically
            extract:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Amount from your speech</li>
            <li>Merchant name</li>
            <li>Category (if mentioned)</li>
            <li>Date/time information</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Review and adjust the auto-filled fields before saving.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Scan Receipt (Optional)"
          image="/guides/transactions/expensescan.png"
        >
          <p>
            Click the <strong>&quot;Scan Receipt&quot;</strong> button to use
            your camera to capture a receipt. The system will attempt to
            extract:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Total amount</li>
            <li>Merchant name</li>
            <li>Date</li>
            <li>Category (based on merchant type)</li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={5} title="Save the Expense">
          <p>
            Once you&apos;ve filled in the required fields, click the{" "}
            <strong>&quot;Save Transaction&quot;</strong> button. The expense
            will be recorded and your account balance will be automatically
            updated.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Click <strong>&quot;Cancel&quot;</strong> if you want to discard the
            expense without saving.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Quick Access from Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            You can quickly add an expense from the dashboard using the{" "}
            <strong>&quot;Add Expense&quot;</strong> button in the Quick Actions
            card, or click <strong>&quot;Scan Receipt&quot;</strong> to go
            directly to the receipt scanner.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
