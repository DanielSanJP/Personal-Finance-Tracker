import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function ViewingAccountsPage() {
  return (
    <GuideLayout
      title="Viewing Account Details"
      description="Learn how to view and understand your account information"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Your accounts page displays all your financial accounts in one place,
          making it easy to monitor balances and account status at a glance.
        </p>

        <GuideStep
          stepNumber={1}
          title="Access the Accounts Page"
          image="/guides/accounts/BankAccounts.png"
        >
          <p>
            Click on your profile picture or name in the top right corner to
            open the profile dropdown menu. Select{" "}
            <strong>&quot;Bank Accounts&quot;</strong> from the dropdown. This
            displays all your accounts in a grid layout.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="View Account Cards"
          image="/guides/accounts/account-cards.png"
        >
          <p>
            Each account is displayed as a card containing the following
            information:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Account Name:</strong> The name you gave the account
            </li>
            <li>
              <strong>Account Type:</strong> Displayed as a colored badge
              (Checking, Savings, Credit, or Investment)
            </li>
            <li>
              <strong>Current Balance:</strong> The account&apos;s current
              balance in large, bold text
            </li>
            <li>
              <strong>Account Number:</strong> If provided, shown below the
              balance
            </li>
            <li>
              <strong>Status:</strong> Shows whether the account is Active or
              Inactive
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Understanding Account Type Colors"
          image="/guides/accounts/account-types.png"
        >
          <p>
            Account type badges are color-coded to help you quickly identify
            different account types:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Blue:</strong> Checking accounts
            </li>
            <li>
              <strong>Green:</strong> Savings accounts
            </li>
            <li>
              <strong>Red:</strong> Credit accounts
            </li>
            <li>
              <strong>Purple:</strong> Investment accounts
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Check Account Status"
          image="/guides/accounts/account-status.png"
        >
          <p>
            At the bottom of each account card, you&apos;ll see a status
            indicator:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Active (Green):</strong> The account is currently active
              and available for transactions
            </li>
            <li>
              <strong>Inactive (Gray):</strong> The account is inactive and may
              not be used for new transactions
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Empty State"
          image="/guides/accounts/empty-accounts.png"
          tip="Start by adding your primary checking or savings account first."
        >
          <p>
            If you haven&apos;t added any accounts yet, you&apos;ll see an empty
            state message with a button to add your first account. Click{" "}
            <strong>&quot;Add Account&quot;</strong> to get started.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
          <p className="text-sm text-muted-foreground">
            Your account balances automatically update when you add
            transactions. Check the Accounts page regularly to stay on top of
            your finances and ensure all balances are accurate.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
