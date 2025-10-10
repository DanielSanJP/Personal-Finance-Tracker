import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function SettingUpProfilePage() {
  return (
    <GuideLayout
      title="Setting Up Your Profile"
      description="Customize your profile and preferences for a personalized experience"
    >
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Your profile contains your basic personal information that will be
          displayed throughout the app. Keep it up to date for a personalized
          experience.
        </p>

        <GuideStep
          stepNumber={1}
          title="Access Your Profile Settings"
          image="/guides/profiles/dropdown-profile.png"
        >
          <p>
            Click your profile picture or name in the top right corner of the
            dashboard. Select <strong>&quot;Profiles&quot;</strong>from the
            dropdown menu.
          </p>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Update Personal Information"
          image="/guides/profiles/profiles.png"
        >
          <p>In the profile section, you can update:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>
              <strong>First Name:</strong> Your first name
            </li>
            <li>
              <strong>Last Name:</strong> Your last name
            </li>
            <li>
              <strong>Display Name:</strong> How you want to be addressed in the
              app (optional - defaults to first and last name if left empty)
            </li>
          </ul>
        </GuideStep>

        <GuideStep stepNumber={3} title="Save Your Changes">
          <p>
            After updating your information, click the{" "}
            <strong>&quot;Save Changes&quot;</strong> button at the bottom of
            the form. You&apos;ll see a confirmation message when your profile
            is updated successfully.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If you don&apos;t want to save your changes, click the{" "}
            <strong>&quot;Cancel&quot;</strong> button to discard them.
          </p>
        </GuideStep>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">
            Need to Make Changes Later?
          </h3>
          <p className="text-sm text-muted-foreground">
            You can update your profile information anytime by accessing Profile
            Settings from the navigation menu. Your changes are saved
            immediately after clicking &quot;Save Changes&quot;.
          </p>
        </div>
      </div>
    </GuideLayout>
  );
}
