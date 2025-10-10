import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const preferencesGuides = [
  {
    title: "Customizing Preferences",
    description: "Personalize your experience with custom settings",
    href: "/guides/preferences/customizing",
  },
  {
    title: "Notification Settings",
    description: "Control when and how you receive alerts and reminders",
    href: "/guides/preferences/notifications",
  },
  {
    title: "Currency & Format",
    description: "Set your currency, date format, and regional preferences",
    href: "/guides/preferences/currency",
  },
  {
    title: "Account Settings",
    description: "Manage your profile, password, and account security",
    href: "/guides/preferences/account",
  },
];

export default function PreferencesOverviewPage() {
  return (
    <GuideLayout
      title="Preferences & Settings Overview"
      description="Customize your Personal Finance Tracker experience"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed">
          Make the app work for you by customizing preferences and settings.
          Control notifications, set your currency, adjust date formats, and
          manage your account security. A personalized experience helps you stay
          organized and motivated.
        </p>

        {/* All Guides */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            In This Section
          </h2>
          <div className="grid gap-4">
            {preferencesGuides.map((guide) => (
              <Link key={guide.href} href={guide.href}>
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-2 hover:border-gray-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {guide.description}
                        </p>
                      </div>
                      <ArrowRight className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Settings Tips
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Set Up Notifications
                  </h3>
                  <p className="text-sm text-gray-700">
                    Enable budget alerts and reminders to stay on track without
                    constantly checking the app.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6c.304 0 .792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029c-.472.786-.96.979-1.264.979-.304 0-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H10a1 1 0 100-2H8.017a7.36 7.36 0 010-1H10a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Choose Your Currency
                  </h3>
                  <p className="text-sm text-gray-700">
                    Set your local currency early so all amounts display
                    correctly throughout the app.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Secure Your Account
                  </h3>
                  <p className="text-sm text-gray-700">
                    Use a strong password and keep your email address up to date
                    for account recovery.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Review Periodically
                  </h3>
                  <p className="text-sm text-gray-700">
                    Check your settings every few months to ensure they still
                    match your needs and preferences.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Topics */}
        <Card className="bg-gray-50 border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Related Topics
            </h2>
            <p className="text-gray-600 mb-4">
              Settings enhance these other features
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/guides/getting-started/profile"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Profile</h3>
                <p className="text-sm text-gray-600">
                  Set up your personal information
                </p>
              </Link>
              <Link
                href="/guides/budgets/alerts"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Budget Alerts
                </h3>
                <p className="text-sm text-gray-600">
                  Configure when you get budget notifications
                </p>
              </Link>
              <Link
                href="/guides/getting-started/dashboard"
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow border"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Dashboard</h3>
                <p className="text-sm text-gray-600">
                  Customize your dashboard view
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
