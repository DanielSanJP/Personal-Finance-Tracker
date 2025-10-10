import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function ContributingToGoalsPage() {
  return (
    <GuideLayout
      title="Contributing to Goals"
      description="Learn how to add money to your savings goals from your accounts"
    >
      <GuideStep
        stepNumber={1}
        title="Navigate to Goals Page"
        image="/guides/goals/goals2.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Go to the <strong className="text-foreground">Goals</strong> page from
          the main navigation. You&apos;ll see all your active savings goals
          displayed with their current progress.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Click Make Contribution"
        image="/guides/goals/goalcontribute.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          In the <strong className="text-foreground">Quick Actions</strong>{" "}
          card, click the{" "}
          <strong className="text-foreground">Make Contribution</strong> button.
          This opens a dialog where you&apos;ll specify which goal to contribute
          to and how much.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Select Your Goal"
        image="/guides/goals/goalselect.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click the <strong className="text-foreground">Select Goal</strong>{" "}
          dropdown and choose which goal you want to contribute to. Each option
          shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Goal name</li>
          <li>Current amount saved</li>
          <li>Target amount</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          This helps you see which goals need more contributions and which are
          close to completion.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={4}
        title="Choose Source Account"
        image="/guides/goals/goalaccountselect.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Click the <strong className="text-foreground">Select Account</strong>{" "}
          dropdown and choose which account the money will come from. Each
          account shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Account name</li>
          <li>Current balance</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Make sure the account has enough balance to cover your contribution.
          The system will check this before allowing the contribution.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={5}
        title="Enter Contribution Amount"
        image="/guides/goals/goalcontributeamount.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          In the{" "}
          <strong className="text-foreground">Contribution Amount</strong>{" "}
          field, enter how much you want to contribute. Important notes:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Amount must be greater than $0</li>
          <li>Cannot exceed your account balance</li>
          <li>Can contribute any amount - no minimum required</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          The money will be deducted from your selected account and added to
          your goal&apos;s current amount.
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Set Contribution Date">
        <p className="text-muted-foreground leading-relaxed">
          Use the date and time picker to set when this contribution was made.
          By default, it&apos;s set to the current date and time. You can adjust
          this if you&apos;re recording a contribution that was made earlier.
        </p>
      </GuideStep>

      <GuideStep stepNumber={7} title="Add Notes (Optional)">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Optionally, add a note about this contribution in the{" "}
          <strong className="text-foreground">Notes</strong> field. Examples:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>&quot;Monthly savings deposit&quot;</li>
          <li>&quot;Birthday money from grandma&quot;</li>
          <li>&quot;Tax refund contribution&quot;</li>
          <li>&quot;Bonus from work&quot;</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Notes help you remember where the money came from when reviewing your
          goal progress later.
        </p>
      </GuideStep>

      <GuideStep stepNumber={8} title="Complete the Contribution">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Review all the details and click{" "}
          <strong className="text-foreground">Add Contribution</strong>. The
          system will:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
          <li>Deduct the amount from your selected account</li>
          <li>Add the amount to your goal&apos;s current savings</li>
          <li>Update the progress bar automatically</li>
          <li>Check if you&apos;ve reached your goal</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-3">
          You&apos;ll see your goal&apos;s progress bar update immediately to
          reflect the new contribution!
        </p>
      </GuideStep>

      <div className="mt-8 space-y-4">
        <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Set up a regular contribution schedule - like contributing every
            payday or monthly. Consistent small contributions add up faster than
            you think and help you reach your goals without feeling the
            financial strain.
          </p>
        </div>

        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">Important</h3>
          <p className="text-sm text-amber-800">
            Contributions directly affect your account balance. Make sure you
            have enough money in the account to cover expenses before making
            large goal contributions. Your emergency fund goal should be
            prioritized before other savings goals.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
