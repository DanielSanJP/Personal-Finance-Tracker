import { GuideLayout } from "@/components/guides/GuideLayout";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  BookOpen,
  CreditCard,
  DollarSign,
  Target,
  BarChart3,
  Settings,
  Camera,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const guideCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: BookOpen,
    href: "/guides/getting-started",
    guides: [
      "Creating Your Account",
      "Understanding the Dashboard",
      "Setting Up Your Profile",
    ],
  },
  {
    title: "Accounts",
    description: "Manage your financial accounts",
    icon: CreditCard,
    href: "/guides/accounts",
    guides: [
      "Adding Accounts",
      "Viewing Details",
      "Editing Information",
      "Managing Multiple Accounts",
    ],
  },
  {
    title: "Transactions",
    description: "Track your income and expenses",
    icon: DollarSign,
    href: "/guides/transactions",
    guides: [
      "Adding Expenses",
      "Adding Income",
      "Editing Transactions",
      "Bulk Operations",
    ],
  },
  {
    title: "Smart Input Features",
    description: "Use voice and receipt scanning",
    icon: Camera,
    href: "/guides/smart-input",
    guides: ["Voice Input", "Receipt Scanning"],
  },
  {
    title: "Budgets",
    description: "Create and manage your budgets",
    icon: TrendingUp,
    href: "/guides/budgets",
    guides: [
      "Creating Budgets",
      "Tracking Progress",
      "Budget Alerts",
      "Best Practices",
    ],
  },
  {
    title: "Goals",
    description: "Set and achieve financial goals",
    icon: Target,
    href: "/guides/goals",
    guides: [
      "Creating Goals",
      "Contributing",
      "Tracking Progress",
      "Completing Goals",
    ],
  },
  {
    title: "Reports & Analytics",
    description: "Visualize your financial data",
    icon: BarChart3,
    href: "/guides/reports",
    guides: [
      "Viewing Reports",
      "Understanding Charts",
      "Exporting Data",
      "Summaries",
    ],
  },
  {
    title: "Preferences & Settings",
    description: "Customize your experience",
    icon: Settings,
    href: "/guides/preferences",
    guides: [
      "Preferences",
      "Notifications",
      "Currency Settings",
      "Account Settings",
    ],
  },
  {
    title: "Tips & Best Practices",
    description: "Expert advice for better financial management",
    icon: Lightbulb,
    href: "/guides/tips",
    guides: [
      "Budgeting Tips",
      "Goal Strategies",
      "Organization Tips",
      "Category Usage",
    ],
  },
];

export default function GuidesPage() {
  return (
    <GuideLayout
      title="Welcome to Personal Finance Tracker Docs"
      description="Comprehensive guides to help you master your personal finances"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          Learn how to track expenses, manage budgets, set goals, and gain
          insights into your spending habits. Choose a category below to get
          started.
        </p>

        {/* Guide Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guideCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.href}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-gray-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-black text-white rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {category.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <ul className="space-y-2">
                      {category.guides.map((guide) => (
                        <li
                          key={guide}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <span className="mr-2">•</span>
                          {guide}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Help Section */}
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Need Quick Help?
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Can&apos;t find what you&apos;re looking for? Here are some quick
              links
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/guides/overview">
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Quick Start Guide
                </button>
              </Link>
              <Link href="/guides/transactions/adding-expense">
                <button className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-white transition-colors">
                  Add Your First Transaction
                </button>
              </Link>
              <Link href="/guides/smart-input/receipt-scanning">
                <button className="px-6 py-2 border-2 border-gray-300 rounded-lg hover:bg-white transition-colors">
                  Try Receipt Scanning
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  );
}
