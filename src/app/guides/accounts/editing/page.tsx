import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function EditingAccountPage() {
  return (
    <GuideLayout
      title="Editing Account Information"
      description="Learn how to update and modify your account details"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          You can edit your account information at any time to update the name,
          balance, account number, or change the active status.
        </p>

        <GuideStep
          stepNumber={1}
          title="Navigate to Accounts"
          image="/guides/accounts/BankAccountsNav.png"
        >
          <p>
            Click on your profile picture or name in the top right corner to
            open the profile dropdown menu. Select{" "}
            <strong>&quot;Accounts&quot;</strong> from the menu. Your accounts
            will be displayed as cards in a grid layout.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Click the Edit Button"
          image="/guides/accounts/account-edit.png"
        >
          <p>
            On the account card you want to edit, click the{" "}
            <strong>Edit button</strong> (pencil icon) located at the bottom
            right corner of the card. This will open the Edit Account modal.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Update Account Name"
          image="/guides/accounts/account-edit-name.png"
          tip="Choose a clear, descriptive name that helps you quickly identify the account."
        >
          <p>
            In the edit modal, you can change the{" "}
            <strong>&quot;Account Name&quot;</strong>. This field is required
            and will be displayed throughout the app wherever the account is
            referenced.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Change Account Type"
          image="/guides/accounts/account-edit-type.png"
        >
          <p>
            Select a different account type from the dropdown if needed. You can
            choose from:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Checking</li>
            <li>Savings</li>
            <li>Credit</li>
            <li>Investment</li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Update Balance"
          image="/guides/accounts/account-edit-balance.png"
          warning="Be careful when manually updating the balance. It's usually better to let transactions update the balance automatically."
        >
          <p>
            You can manually update the <strong>&quot;Balance&quot;</strong>{" "}
            field. Enter the new balance as a decimal number (e.g., 1234.56).
            This is useful for reconciling accounts or correcting errors.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={6}
          title="Update Account Number"
          image="/guides/accounts/account-edit-number.png"
        >
          <p>
            The <strong>&quot;Account Number&quot;</strong> field is optional.
            You can add, change, or remove the account number. This helps you
            identify which physical account this represents.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={7}
          title="Change Active Status"
          image="/guides/accounts/account-edit-status.png"
        >
          <p>
            You can toggle the account&apos;s active status. Inactive accounts
            are still visible but may be excluded from certain calculations or
            reports. Use this for closed accounts or accounts you&apos;re not
            currently tracking.
          </p>
        </GuideStep>

        <GuideStep stepNumber={8} title="Save Your Changes">
          <p>
            Once you&apos;ve made your changes, click the{" "}
            <strong>&quot;Save&quot;</strong> button at the bottom of the modal.
            You&apos;ll see a success notification, and the account card will
            update with your changes.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you want to discard your changes, click the{" "}
            <strong>&quot;Cancel&quot;</strong> button or the X in the top right
            corner of the modal.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Need to Delete an Account?
          </h3>
          <p className="text-sm text-muted-foreground">
            Currently, you can set an account to inactive instead of deleting
            it. This preserves your transaction history while removing the
            account from active use. Simply edit the account and toggle the
            active status to off.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
