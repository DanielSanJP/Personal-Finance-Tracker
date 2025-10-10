import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function AccountSettingsGuide() {
  return (
    <GuideLayout
      title="Account Settings"
      description="Manage your email address and password"
    >
      <GuideStep
        stepNumber={1}
        title="Navigate to Settings"
        image="/guides/preferences/settings.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Click on <strong className="text-foreground">Settings</strong> in the
          main navigation menu to access your account security settings.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Update Email Address"
        image="/guides/preferences/email.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          To change your email address:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Your current email is displayed in the{" "}
            <strong className="text-foreground">Current Email</strong> field
          </li>
          <li>
            Enter your new email in the{" "}
            <strong className="text-foreground">New Email</strong> field
          </li>
          <li>
            Click <strong className="text-foreground">Update Email</strong>
          </li>
          <li>Check your new email inbox for a confirmation link</li>
          <li>Click the link to complete the email change</li>
        </ol>
        <p className="text-sm text-muted-foreground mt-3">
          Email must be valid format (e.g., user@example.com)
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={3}
        title="Change Password"
        image="/guides/preferences/password.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          To update your password:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            Enter your new password in the{" "}
            <strong className="text-foreground">New Password</strong> field
          </li>
          <li>
            Re-enter it in the{" "}
            <strong className="text-foreground">Confirm Password</strong> field
          </li>
          <li>
            Click <strong className="text-foreground">Update Password</strong>
          </li>
          <li>A success message will confirm the change</li>
        </ol>
        <p className="text-sm text-muted-foreground mt-3">
          Password must be at least 8 characters long
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Password Visibility Toggle">
        <p className="text-muted-foreground leading-relaxed">
          Each password field has an eye icon on the right side. Click it to
          toggle between showing and hiding your password as you type.
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Security Best Practices">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Follow these security recommendations:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Use a strong, unique password (at least 8 characters)</li>
          <li>Include uppercase, lowercase, numbers, and symbols</li>
          <li>Don&apos;t reuse passwords from other accounts</li>
          <li>Change your password regularly (every 3-6 months)</li>
          <li>Never share your password with anyone</li>
        </ul>
      </GuideStep>

      <GuideStep stepNumber={6} title="Guest Account Limitations">
        <p className="text-muted-foreground leading-relaxed">
          If you&apos;re using a guest account, you&apos;ll see a warning that
          you cannot update email or password. Guest accounts are read-only
          demonstrations. Create a real account to access full functionality.
        </p>
      </GuideStep>
    </GuideLayout>
  );
}
