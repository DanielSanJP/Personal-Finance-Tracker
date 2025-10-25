import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function AddingAccountPage() {
  return (
    <GuideLayout
      title="Adding a New Account"
      description="Learn how to add a new financial account to track in Personal Finance Tracker"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Adding accounts helps you organize and track your finances across
          different banks, credit cards, and investment platforms. Follow these
          steps to add a new account.
        </p>

        <GuideStep
          stepNumber={1}
          title="Navigate to Accounts Page"
          image="/guides/accounts/BankAccounts.png"
        >
          <p>
            Click on your profile picture or name in the top right corner to
            open the profile dropdown menu. Then select{" "}
            <strong>&quot;Bank Accounts&quot;</strong> from the menu. This will
            take you to your accounts overview page.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Click Add New Account"
          image="/guides/accounts/add-new.png"
        >
          <p>
            On the Accounts page, click the{" "}
            <strong>&quot;Add Account&quot;</strong> button. This will open the
            account creation form.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Enter Account Name"
          image="/guides/accounts/account-name.png"
          tip="Use a descriptive name that helps you identify the account, like 'Chase Checking' or 'Savings - Emergency Fund'."
        >
          <p>
            Enter a name for your account in the{" "}
            <strong>&quot;Account Name&quot;</strong> field. This is a required
            field and will be displayed throughout the app.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Select Account Type"
          image="/guides/accounts/account-type.png"
        >
          <p>
            Choose the appropriate account type from the dropdown menu.
            Available types include:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Checking:</strong> For everyday checking accounts
            </li>
            <li>
              <strong>Savings:</strong> For savings accounts and money market
              accounts
            </li>
            <li>
              <strong>Credit:</strong> For credit cards and lines of credit
            </li>
            <li>
              <strong>Investment:</strong> For investment accounts, retirement
              funds, etc.
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Enter Initial Balance"
          image="/guides/accounts/initial-balance.png"
          tip="Enter the current balance of the account. You can update this later if needed."
        >
          <p>
            Enter the current balance of your account in the{" "}
            <strong>&quot;Initial Balance&quot;</strong> field. This is a
            required field. Enter the amount as a decimal number (e.g.,
            1234.56).
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={6}
          title="Add Account Number (Optional)"
          image="/guides/accounts/account-number.png"
        >
          <p>
            Optionally, you can enter your account number in the{" "}
            <strong>&quot;Account Number&quot;</strong> field. This helps you
            identify which physical account this represents and will be
            displayed on the account card.
          </p>
        </GuideStep>

        <GuideStep stepNumber={7} title="Create the Account">
          <p>
            Once all required fields are filled in, click the{" "}
            <strong>&quot;Create Account&quot;</strong> button. You&apos;ll see
            a success message and be redirected back to the Accounts page where
            your new account will appear.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you change your mind, click the{" "}
            <strong>&quot;Cancel&quot;</strong> button to go back without
            saving.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            What&apos;s Next?
          </h3>
          <p className="text-sm text-muted-foreground">
            After adding your account, you can start recording transactions
            associated with it. The account balance will automatically update as
            you add income and expenses.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
