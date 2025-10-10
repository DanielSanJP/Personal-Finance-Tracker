import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CreatingYourAccountPage() {
  return (
    <GuideLayout
      title="Creating Your Account"
      description="Get started with Personal Finance Tracker by creating your account"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Creating an account is quick and easy. Follow these steps to get
          started with Personal Finance Tracker and begin managing your
          finances.
        </p>

        <GuideStep
          stepNumber={1}
          title="Navigate to the Registration Page"
          image="/guides/accounts/create-account.png"
        >
          <p>
            Click the <strong>&quot;Sign Up&quot;</strong> or{" "}
            <strong>&quot;Get Started&quot;</strong> button on the homepage.
            You&apos;ll be taken to the registration form.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Enter Your Information"
          image="/guides/accounts/account-details.png"
          imageAlt="Registration form showing email, password, and name fields"
        >
          <p>Fill in the required fields:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>Email address:</strong> Use a valid email you have access
              to
            </li>
            <li>
              <strong>Password:</strong> Create a strong password (at least 8
              characters)
            </li>
            <li>
              <strong>Full name:</strong> Enter your name for personalization
            </li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Verify Your Email"
          tip="Check your spam folder if you don't see the verification email within a few minutes."
        >
          <p>
            After submitting the form, check your email inbox for a verification
            link. Click the link to verify your email address and activate your
            account.
          </p>
        </GuideStep>

        <GuideStep stepNumber={4} title="Start Using Personal Finance Tracker">
          <p>
            Congratulations! Your account is now set up. You&apos;ll be
            redirected to your dashboard where you can start adding accounts,
            recording transactions, and managing your finances.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            What&apos;s Next?
          </h3>
          <p className="text-sm text-muted-foreground">
            Now that your account is created, we recommend exploring the
            dashboard to understand the main features. Then, add your first
            account to start tracking your finances.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
