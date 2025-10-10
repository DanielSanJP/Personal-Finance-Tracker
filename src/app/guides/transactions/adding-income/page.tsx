import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function AddingIncomePage() {
  return (
    <GuideLayout
      title="Adding Income"
      description="Learn how to record income transactions in Personal Finance Tracker"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Recording income helps you track your earnings and maintain accurate
          account balances. You can add income manually or use voice input for
          faster entry.
        </p>

        <GuideStep
          stepNumber={1}
          title="Fill in Required Fields"
          image="/guides/transactions/incomeform.png"
        >
          <p>Complete all required fields marked with an asterisk (*):</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Amount:</strong> Enter the income amount as a positive
              number (e.g., 2500.00)
            </li>
            <li>
              <strong>Description:</strong> Brief description of the income
              (e.g., &quot;Monthly salary&quot;)
            </li>
            <li>
              <strong>Income Source:</strong> Name of the company or person
              (e.g., &quot;Tech Corp Inc&quot;)
            </li>
            <li>
              <strong>Account:</strong> Select which account receives this
              income
            </li>
            <li>
              <strong>Date:</strong> When the income was received (defaults to
              today)
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Add Optional Details"
          image="/guides/transactions/incomeformcategory.png"
        >
          <p>Enhance your income tracking with optional information:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Category:</strong> Categorize the income (e.g., Salary,
              Freelance, Investment, Bonus)
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Use Voice Input (Optional)"
          image="/guides/transactions/incomevoice.png"
          tip="Speak naturally: 'I received twenty-five hundred dollars salary from Tech Corp today'"
        >
          <p>
            Click the <strong>&quot;Voice Input&quot;</strong> button to speak
            your income transaction. The system will automatically extract:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Amount from your speech</li>
            <li>Income source name</li>
            <li>Category (if mentioned)</li>
            <li>Date/time information</li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            Review and adjust the auto-filled fields before saving.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Use Quick Add Shortcuts"
          image="/guides/transactions/incomequickadd.png"
        >
          <p>
            For frequently used income sources, click one of the quick add
            buttons to automatically fill in the income source field. This
            speeds up entry for recurring income like salary or freelance
            payments.
          </p>
        </GuideStep>

        <GuideStep stepNumber={5} title="Save the Income">
          <p>
            Once you&apos;ve filled in the required fields, click the{" "}
            <strong>&quot;Add Income&quot;</strong> button. The income will be
            recorded and your account balance will be automatically increased.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Click <strong>&quot;Cancel&quot;</strong> if you want to discard the
            income entry without saving.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Quick Access from Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            You can quickly add income from the dashboard using the{" "}
            <strong>&quot;Add Income&quot;</strong> button in the Quick Actions
            card. This takes you directly to the income entry form.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
