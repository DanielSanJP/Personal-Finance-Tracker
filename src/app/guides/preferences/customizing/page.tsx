import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CustomizingPreferencesGuide() {
  return (
    <GuideLayout
      title="Customizing Preferences"
      description="Overview of how to access and save your preferences"
    >
      <GuideStep
        stepNumber={1}
        title="Navigate to Preferences"
        image="/guides/preferences/prefnav.png"
      >
        <p className="text-muted-foreground leading-relaxed">
          Click on <strong className="text-foreground">Preferences</strong> in
          the main navigation menu to access all customization options for the
          app.
        </p>
      </GuideStep>

      <GuideStep
        stepNumber={2}
        title="Preferences Sections Overview"
        image="/guides/preferences/preferences.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          The Preferences page is organized into three main sections:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Appearance:</strong> Control
            theme, currency, and language settings
          </li>
          <li>
            <strong className="text-foreground">Notifications:</strong> Manage
            email alerts, budget warnings, goal reminders, and weekly reports
          </li>
          <li>
            <strong className="text-foreground">Display Options:</strong>{" "}
            Customize how information is displayed throughout the app
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Each section has specific settings you can configure independently
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Making Changes">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Preferences use different types of controls:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">Dropdowns:</strong> Click to see
            available options (theme, currency, language)
          </li>
          <li>
            <strong className="text-foreground">Toggle Switches:</strong> Click
            to turn settings on or off (notifications, display options)
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          You can modify multiple settings before saving
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Saving Your Changes">
        <p className="text-muted-foreground leading-relaxed mb-3">
          After adjusting any preferences:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
          <li>Scroll to the bottom of the Preferences page</li>
          <li>
            Click the{" "}
            <strong className="text-foreground">Save Preferences</strong> button
          </li>
          <li>
            A success toast message will appear: &quot;Preferences saved
            successfully&quot;
          </li>
        </ol>
        <div className="border-l-4 border-amber-600 pl-4 mt-3 bg-amber-500/10 p-3 rounded">
          <p className="text-sm text-foreground">
            <strong>Important:</strong> You must click Save Preferences for your
            changes to take effect. If you navigate away without saving, changes
            will be lost.
          </p>
        </div>
      </GuideStep>

      <GuideStep stepNumber={5} title="When Changes Take Effect">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Once you save your preferences:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>Changes apply immediately throughout the app</li>
          <li>Theme changes update the entire interface instantly</li>
          <li>Currency and format changes update all displays</li>
          <li>Notification settings control future alerts</li>
          <li>Display options update lists and tables right away</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          You can return to Preferences anytime to adjust your settings
        </p>
      </GuideStep>
    </GuideLayout>
  );
}
