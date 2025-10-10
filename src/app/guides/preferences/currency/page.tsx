import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function CurrencyFormatGuide() {
  return (
    <GuideLayout
      title="Currency & Format Settings"
      description="Configure currency, language, and number display formats"
    >
      <GuideStep stepNumber={1} title="Choosing Your Currency">
        <p className="text-muted-foreground leading-relaxed mb-3">
          In the <strong className="text-foreground">Appearance</strong> section
          of Preferences, click the{" "}
          <strong className="text-foreground">Default Currency</strong> dropdown
          to select your preferred currency:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">USD ($)</strong> - United States
            Dollar
          </li>
          <li>
            <strong className="text-foreground">EUR (€)</strong> - Euro
          </li>
          <li>
            <strong className="text-foreground">GBP (£)</strong> - British Pound
          </li>
          <li>
            <strong className="text-foreground">CAD (C$)</strong> - Canadian
            Dollar
          </li>
          <li>
            <strong className="text-foreground">AUD (A$)</strong> - Australian
            Dollar
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          The selected currency symbol will appear throughout the entire app
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="What Currency Setting Affects">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Your currency selection impacts these areas:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>All transaction amounts and account balances</li>
          <li>Budget limits and spending totals</li>
          <li>Financial goal targets and progress</li>
          <li>Charts and reports on the Reports page</li>
          <li>Exported CSV and PDF files</li>
          <li>Dashboard summary cards</li>
        </ul>
        <div className="border-l-4 border-amber-500 pl-4 mt-3 bg-amber-50 p-3 rounded">
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> This is a display setting only. It does not
            perform currency conversion. All amounts remain in the same value,
            just with a different symbol.
          </p>
        </div>
      </GuideStep>

      <GuideStep stepNumber={3} title="Language Selection">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Also in the <strong className="text-foreground">Appearance</strong>{" "}
          section, select your preferred language from the{" "}
          <strong className="text-foreground">Language</strong> dropdown:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
          <li>
            <strong className="text-foreground">English</strong> - Default
            language
          </li>
          <li>
            <strong className="text-foreground">Español</strong> - Spanish
          </li>
          <li>
            <strong className="text-foreground">Français</strong> - French
          </li>
          <li>
            <strong className="text-foreground">Deutsch</strong> - German
          </li>
          <li>
            <strong className="text-foreground">Italiano</strong> - Italian
          </li>
        </ul>
        <p className="text-sm text-muted-foreground mt-3">
          Language changes affect all UI text, button labels, and system
          messages
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Show Cents Toggle">
        <p className="text-muted-foreground leading-relaxed mb-3">
          In the <strong className="text-foreground">Display Options</strong>{" "}
          section (below Notifications), toggle{" "}
          <strong className="text-foreground">Show Cents</strong> to control how
          decimal places are displayed:
        </p>
        <div className="space-y-3">
          <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded">
            <p className="text-sm text-green-900">
              <strong>Enabled (with cents):</strong> Displays precise amounts
              like $1,234.56 or €89.99
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-900">
              <strong>Disabled (whole numbers):</strong> Displays rounded
              amounts like $1,235 or €90
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Useful for cleaner displays if you don&apos;t need cent-level
          precision
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Combining Format Settings">
        <p className="text-muted-foreground leading-relaxed mb-3">
          You can combine currency and format settings for your preferred
          display style:
        </p>
        <div className="space-y-2">
          <div className="text-sm">
            <strong className="text-foreground">USD + Show Cents:</strong>{" "}
            $1,234.56
          </div>
          <div className="text-sm">
            <strong className="text-foreground">USD + No Cents:</strong> $1,235
          </div>
          <div className="text-sm">
            <strong className="text-foreground">EUR + Show Cents:</strong>{" "}
            €1,234.56
          </div>
          <div className="text-sm">
            <strong className="text-foreground">GBP + No Cents:</strong> £1,235
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Choose the combination that best matches your preferences and the
          precision you need
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Save Format Settings">
        <p className="text-muted-foreground leading-relaxed">
          After selecting your currency, language, and format options, click{" "}
          <strong className="text-foreground">Save Preferences</strong> at the
          bottom of the page. All amounts and text throughout the app will
          immediately update to reflect your new settings.
        </p>
      </GuideStep>
    </GuideLayout>
  );
}
