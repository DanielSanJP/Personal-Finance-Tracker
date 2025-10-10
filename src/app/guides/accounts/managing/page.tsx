import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function ManagingAccountsPage() {
  return (
    <GuideLayout
      title="Managing Multiple Accounts"
      description="Learn best practices for organizing and tracking multiple financial accounts"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Personal Finance Tracker makes it easy to manage multiple accounts
          across different banks, credit cards, and investment platforms. Here
          are some tips and strategies for effective account management.
        </p>

        <GuideStep
          stepNumber={1}
          title="Organize Your Accounts"
          tip="Use clear, consistent naming conventions like 'Bank Name - Account Type' (e.g., 'Chase - Checking' or 'Discover - Credit Card')."
        >
          <p>
            When you have multiple accounts, organization is key. Use
            descriptive names that help you quickly identify each account. All
            your accounts are displayed in a grid layout on the Accounts page
            for easy overview.
          </p>
        </GuideStep>

        <GuideStep stepNumber={2} title="Use Account Types Effectively">
          <p>
            Take advantage of the account type system to categorize your
            accounts:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Checking:</strong> Day-to-day spending accounts
            </li>
            <li>
              <strong>Savings:</strong> Emergency funds, savings goals
            </li>
            <li>
              <strong>Credit:</strong> Credit cards and lines of credit
            </li>
            <li>
              <strong>Investment:</strong> Retirement accounts, brokerage
              accounts
            </li>
          </ul>
          <p className="mt-2 text-sm text-muted-foreground">
            The color-coded badges make it easy to identify account types at a
            glance.
          </p>
        </GuideStep>

        <GuideStep stepNumber={3} title="Track Balances Across Accounts">
          <p>
            Your dashboard&apos;s <strong>&quot;Accounts Overview&quot;</strong>{" "}
            section displays all your accounts with their current balances. This
            gives you a complete picture of your financial situation across all
            accounts.
          </p>
          <p className="mt-2">
            The Financial Summary on your dashboard also shows your total
            balance across all active accounts.
          </p>
        </GuideStep>

        <GuideStep stepNumber={4} title="Handle Inactive Accounts">
          <p>
            For accounts you&apos;ve closed or are no longer actively using, set
            them to <strong>&quot;Inactive&quot;</strong> status instead of
            deleting them. This:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Preserves your transaction history</li>
            <li>Keeps historical data for reports</li>
            <li>Removes the account from active calculations</li>
            <li>Maintains data integrity</li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Associate Transactions with Accounts"
          tip="Always select the correct account when adding transactions to keep balances accurate."
        >
          <p>
            When adding transactions (income or expenses), you&apos;ll be able
            to select which account the transaction applies to. This ensures
            your account balances stay accurate and up-to-date automatically.
          </p>
        </GuideStep>

        <GuideStep stepNumber={6} title="Regular Account Reconciliation">
          <p>
            Periodically compare the balances shown in Personal Finance Tracker
            with your actual bank statements to ensure accuracy. If you find
            discrepancies:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Check for missing transactions</li>
            <li>Verify transaction amounts</li>
            <li>
              Manually adjust the balance if needed using the edit feature
            </li>
          </ul>
        </GuideStep>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Best Practice</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Start by adding your most frequently used accounts first (usually
            checking and primary credit card). As you get comfortable with the
            system, add additional accounts like savings, investment accounts,
            and secondary credit cards.
          </p>
          <p className="text-sm text-muted-foreground">
            This gradual approach makes it easier to maintain accurate records
            without feeling overwhelmed.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
