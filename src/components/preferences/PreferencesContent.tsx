"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Bell, Globe } from "lucide-react";
import { usePreferences, useAuth } from "@/hooks/queries";
import { usePreferencesMutations } from "@/hooks/mutations";
import { UserPreferences } from "@/types";

export default function PreferencesContent() {
  const { data: preferencesData, isLoading } = usePreferences();
  const { updatePreferences } = usePreferencesMutations();
  const { isAuthenticated } = useAuth();

  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    currency: "USD",
    language: "English",
    email_notifications: true,
    budget_alerts: true,
    goal_reminders: false,
    weekly_reports: true,
    show_account_numbers: false,
    compact_view: false,
    show_cents: true,
  });

  useEffect(() => {
    if (preferencesData) {
      setPreferences({
        currency: preferencesData.currency,
        language: preferencesData.language,
        email_notifications: preferencesData.email_notifications,
        budget_alerts: preferencesData.budget_alerts,
        goal_reminders: preferencesData.goal_reminders,
        weekly_reports: preferencesData.weekly_reports,
        show_account_numbers: preferencesData.show_account_numbers,
        compact_view: preferencesData.compact_view,
        show_cents: preferencesData.show_cents,
      });
    }
  }, [preferencesData]);

  const handleSave = () => {
    if (!isAuthenticated) return;
    updatePreferences.mutate({
      currency: preferences.currency,
      language: preferences.language,
      email_notifications: preferences.email_notifications,
      budget_alerts: preferences.budget_alerts,
      goal_reminders: preferences.goal_reminders,
      weekly_reports: preferences.weekly_reports,
      show_account_numbers: preferences.show_account_numbers,
      compact_view: preferences.compact_view,
      show_cents: preferences.show_cents,
    });
  };

  const updatePreference = (
    key: keyof typeof preferences,
    value: string | boolean
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Preferences
          </CardTitle>
          <p className="text-muted-foreground">
            Customize your Personal Finance Tracker experience.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value) => updatePreference("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="NZD">NZD (NZ$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => updatePreference("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Español">Español</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Deutsch">Deutsch</SelectItem>
                    <SelectItem value="Italiano">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email_notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id="email_notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked: boolean) =>
                    updatePreference("email_notifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="budget_alerts">Budget Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you approach budget limits
                  </p>
                </div>
                <Switch
                  id="budget_alerts"
                  checked={preferences.budget_alerts}
                  onCheckedChange={(checked: boolean) =>
                    updatePreference("budget_alerts", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="goal_reminders">Goal Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about your financial goals
                  </p>
                </div>
                <Switch
                  id="goal_reminders"
                  checked={preferences.goal_reminders}
                  onCheckedChange={(checked: boolean) =>
                    updatePreference("goal_reminders", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly_reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly summaries of your financial activity
                  </p>
                </div>
                <Switch
                  id="weekly_reports"
                  checked={preferences.weekly_reports}
                  onCheckedChange={(checked: boolean) =>
                    updatePreference("weekly_reports", checked)
                  }
                />
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Display Options
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show_account_numbers">
                    Show Account Numbers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display account numbers in account lists
                  </p>
                </div>
                <Switch
                  id="show_account_numbers"
                  checked={preferences.show_account_numbers}
                  onCheckedChange={(checked) =>
                    updatePreference("show_account_numbers", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact_view">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact layout for tables and lists
                  </p>
                </div>
                <Switch
                  id="compact_view"
                  checked={preferences.compact_view}
                  onCheckedChange={(checked) =>
                    updatePreference("compact_view", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show_cents">Show Cents</Label>
                  <p className="text-sm text-muted-foreground">
                    Display currency amounts with decimal places
                  </p>
                </div>
                <Switch
                  id="show_cents"
                  checked={preferences.show_cents}
                  onCheckedChange={(checked) =>
                    updatePreference("show_cents", checked)
                  }
                />
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updatePreferences.isPending || !isAuthenticated}
              className="min-w-32"
            >
              {updatePreferences.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
