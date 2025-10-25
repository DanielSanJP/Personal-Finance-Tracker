import { GuideLayout } from "@/components/guides/GuideLayout";
import { GuideStep } from "@/components/guides/GuideStep";

export default function NotificationSettingsGuide() {
  return (
    <GuideLayout
      title="Notification Settings"
      description="Configure how and when you receive notifications"
    >
      <GuideStep
        stepNumber={1}
        title="Access Notification Settings"
        image="/guides/preferences/notifications.png"
      >
        <p className="text-muted-foreground leading-relaxed mb-3">
          Navigate to <strong className="text-foreground">Preferences</strong>{" "}
          from the main menu and scroll to the{" "}
          <strong className="text-foreground">Notifications</strong> section
          with the bell icon.
        </p>
      </GuideStep>

      <GuideStep stepNumber={2} title="Email Notifications">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Toggle{" "}
          <strong className="text-foreground">Email Notifications</strong> to
          control whether you receive important updates via email.
        </p>
        <p className="text-sm text-muted-foreground">
          When enabled, you&apos;ll receive emails about account activity,
          security alerts, and system updates
        </p>
      </GuideStep>

      <GuideStep stepNumber={3} title="Budget Alerts">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Toggle <strong className="text-foreground">Budget Alerts</strong> to
          get notified when you approach or exceed your budget limits.
        </p>
        <p className="text-sm text-muted-foreground">
          Alerts trigger when spending reaches 80% of budget (warning) and 100%
          (over budget)
        </p>
      </GuideStep>

      <GuideStep stepNumber={4} title="Goal Reminders">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Toggle <strong className="text-foreground">Goal Reminders</strong> to
          receive reminders about your financial goals and target dates.
        </p>
        <p className="text-sm text-muted-foreground">
          Reminders help keep you on track with your savings goals and upcoming
          deadlines
        </p>
      </GuideStep>

      <GuideStep stepNumber={5} title="Weekly Reports">
        <p className="text-muted-foreground leading-relaxed mb-3">
          Toggle <strong className="text-foreground">Weekly Reports</strong> to
          get weekly summaries of your financial activity.
        </p>
        <p className="text-sm text-muted-foreground">
          Reports include spending totals, budget status, goal progress, and
          notable transactions
        </p>
      </GuideStep>

      <GuideStep stepNumber={6} title="Save Notification Settings">
        <p className="text-muted-foreground leading-relaxed">
          After adjusting your notification preferences, click{" "}
          <strong className="text-foreground">Save Preferences</strong> at the
          bottom of the page to apply your changes.
        </p>
      </GuideStep>
    </GuideLayout>
  );
}
