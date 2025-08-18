"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import Nav from "@/components/nav";
import { Settings, Palette, Bell, Globe, Moon, Sun } from "lucide-react";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Appearance
    theme: "light",
    currency: "USD",
    language: "en",

    // Notifications
    emailNotifications: true,
    budgetAlerts: true,
    goalReminders: false,
    weeklyReports: true,

    // Display
    showAccountNumbers: false,
    compactView: false,
    showCents: true,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Preferences saved successfully!", {
      description: "Your settings have been updated.",
    });

    setSaving(false);
  };

  const updatePreference = (key: string, value: string | boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

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
            {/* Appearance Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value) => updatePreference("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select
                    value={preferences.currency}
                    onValueChange={(value) =>
                      updatePreference("currency", value)
                    }
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => updatePreference("language", value)}
                >
                  <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked: boolean) =>
                      updatePreference("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="budgetAlerts">Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you approach budget limits
                    </p>
                  </div>
                  <Switch
                    id="budgetAlerts"
                    checked={preferences.budgetAlerts}
                    onCheckedChange={(checked: boolean) =>
                      updatePreference("budgetAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="goalReminders">Goal Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about your financial goals
                    </p>
                  </div>
                  <Switch
                    id="goalReminders"
                    checked={preferences.goalReminders}
                    onCheckedChange={(checked: boolean) =>
                      updatePreference("goalReminders", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weeklyReports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Get weekly summaries of your financial activity
                    </p>
                  </div>
                  <Switch
                    id="weeklyReports"
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked: boolean) =>
                      updatePreference("weeklyReports", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Display Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Display Options
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showAccountNumbers">
                      Show Account Numbers
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display account numbers in account lists
                    </p>
                  </div>
                  <Switch
                    id="showAccountNumbers"
                    checked={preferences.showAccountNumbers}
                    onCheckedChange={(checked) =>
                      updatePreference("showAccountNumbers", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compactView">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact layout for tables and lists
                    </p>
                  </div>
                  <Switch
                    id="compactView"
                    checked={preferences.compactView}
                    onCheckedChange={(checked) =>
                      updatePreference("compactView", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showCents">Show Cents</Label>
                    <p className="text-sm text-muted-foreground">
                      Display currency amounts with decimal places
                    </p>
                  </div>
                  <Switch
                    id="showCents"
                    checked={preferences.showCents}
                    onCheckedChange={(checked) =>
                      updatePreference("showCents", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="min-w-32"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
