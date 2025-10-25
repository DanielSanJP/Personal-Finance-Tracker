"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface GuideSection {
  title: string;
  items: {
    title: string;
    href: string;
  }[];
}

const guideSections: GuideSection[] = [
  {
    title: "Overview",
    items: [{ title: "Introduction", href: "/guides/overview" }],
  },
  {
    title: "Getting Started",
    items: [
      { title: "Getting Started", href: "/guides/getting-started" },
      {
        title: "Creating Your Account",
        href: "/guides/getting-started/account",
      },
      {
        title: "Understanding the Dashboard",
        href: "/guides/getting-started/dashboard",
      },
      {
        title: "Setting Up Your Profile",
        href: "/guides/getting-started/profile",
      },
    ],
  },
  {
    title: "Bank Accounts",
    items: [
      { title: "Bank Accounts", href: "/guides/accounts" },
      { title: "Adding a New Account", href: "/guides/accounts/adding" },
      { title: "Viewing Account Details", href: "/guides/accounts/viewing" },
      {
        title: "Editing Account Information",
        href: "/guides/accounts/editing",
      },
      {
        title: "Managing Multiple Accounts",
        href: "/guides/accounts/managing",
      },
    ],
  },
  {
    title: "Transactions",
    items: [
      { title: "Transactions", href: "/guides/transactions" },
      {
        title: "Filtering & Searching",
        href: "/guides/transactions/filtering-searching",
      },
      {
        title: "Adding an Expense",
        href: "/guides/transactions/adding-expense",
      },
      { title: "Adding Income", href: "/guides/transactions/adding-income" },
      {
        title: "Viewing Transaction Details",
        href: "/guides/transactions/viewing-details",
      },
      { title: "Editing Transactions", href: "/guides/transactions/editing" },
      { title: "Bulk Editing", href: "/guides/transactions/bulk-editing" },
      { title: "Deleting Transactions", href: "/guides/transactions/deleting" },
    ],
  },
  {
    title: "Smart Input Features",
    items: [
      { title: "Smart Input", href: "/guides/smart-input" },
      {
        title: "Voice Input for Transactions",
        href: "/guides/smart-input/voice",
      },
      {
        title: "Receipt Scanning",
        href: "/guides/smart-input/receipt-scanning",
      },
    ],
  },
  {
    title: "Budgets",
    items: [
      { title: "Budgets", href: "/guides/budgets" },
      { title: "Creating a Budget", href: "/guides/budgets/creating" },
      {
        title: "Setting Budget Categories",
        href: "/guides/budgets/categories",
      },
      { title: "Tracking Budget Progress", href: "/guides/budgets/tracking" },
      { title: "Editing Budgets", href: "/guides/budgets/editing" },
      { title: "Budget Alerts", href: "/guides/budgets/alerts" },
    ],
  },
  {
    title: "Goals",
    items: [
      { title: "Goals", href: "/guides/goals" },
      { title: "Creating a Financial Goal", href: "/guides/goals/creating" },
      { title: "Contributing to Goals", href: "/guides/goals/contributing" },
      { title: "Tracking Goal Progress", href: "/guides/goals/tracking" },
      { title: "Editing Goals", href: "/guides/goals/editing" },
      { title: "Completing Goals", href: "/guides/goals/completing" },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      { title: "Reports", href: "/guides/reports" },
      { title: "Viewing Financial Reports", href: "/guides/reports/viewing" },
      { title: "Understanding Charts", href: "/guides/reports/charts" },
      { title: "Pie Charts & Breakdowns", href: "/guides/reports/pie-charts" },
      { title: "Exporting Reports", href: "/guides/reports/exporting" },
      { title: "Monthly/Yearly Summaries", href: "/guides/reports/summaries" },
    ],
  },
  {
    title: "Preferences & Settings",
    items: [
      { title: "Preferences", href: "/guides/preferences" },
      {
        title: "Customizing Preferences",
        href: "/guides/preferences/customizing",
      },
      {
        title: "Notification Settings",
        href: "/guides/preferences/notifications",
      },
      { title: "Currency & Format", href: "/guides/preferences/currency" },
      { title: "Account Settings", href: "/guides/preferences/account" },
    ],
  },
  {
    title: "Tips & Best Practices",
    items: [
      { title: "Tips", href: "/guides/tips" },
      { title: "Budgeting Best Practices", href: "/guides/tips/budgeting" },
      { title: "Goal Setting Strategies", href: "/guides/tips/goal-setting" },
      { title: "Organizing Transactions", href: "/guides/tips/organizing" },
      {
        title: "Using Categories Effectively",
        href: "/guides/tips/categories",
      },
    ],
  },
];

interface GuideLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

function GuideSidebar() {
  const pathname = usePathname();

  // Save and restore scroll position
  useEffect(() => {
    const sidebarContent = document.querySelector('[data-sidebar="content"]');
    if (sidebarContent) {
      // Restore scroll position
      const savedScroll = sessionStorage.getItem("sidebar_scroll");
      if (savedScroll) {
        sidebarContent.scrollTop = parseInt(savedScroll, 10);
      }

      // Save scroll position on scroll
      const handleScroll = () => {
        sessionStorage.setItem(
          "sidebar_scroll",
          String(sidebarContent.scrollTop)
        );
      };
      sidebarContent.addEventListener("scroll", handleScroll);

      return () => {
        sidebarContent.removeEventListener("scroll", handleScroll);
      };
    }
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <Image
            src="/logo.svg"
            alt="Personal Finance Tracker"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Personal Finance</span>
            <span className="text-xs text-muted-foreground">Documentation</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Home Link */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/guides">
                  <BookOpen className="h-4 w-4" />
                  <span>Guides</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Navigation Sections */}
        {guideSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export function GuideLayout({
  children,
  title,
  description,
}: GuideLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Read sidebar state from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const sidebarCookie = cookies.find((c) => c.startsWith("sidebar_state="));
    if (sidebarCookie) {
      const value = sidebarCookie.split("=")[1];
      setSidebarOpen(value === "true");
    }
  }, []);

  // Find current page index for navigation
  const allPages = guideSections.flatMap((section) => section.items);
  const currentIndex = allPages.findIndex((page) => page.href === pathname);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage =
    currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <GuideSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="mx-auto w-full max-w-6xl">
            {title && (
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {title}
                </h1>
                {description && (
                  <p className="text-lg text-muted-foreground">{description}</p>
                )}
              </div>
            )}

            <Card className="p-6 sm:p-8">{children}</Card>

            {/* Navigation Footer */}
            <div className="flex flex-wrap justify-between items-stretch gap-4 mt-8 pt-8 border-t pb-20 sm:pb-8">
              {prevPage ? (
                <Link
                  href={prevPage.href}
                  className="flex-1 sm:flex-initial max-w-[calc(50%-0.5rem)] sm:max-w-none"
                >
                  <Button
                    variant="outline"
                    className="gap-2 w-full sm:w-auto h-full justify-start"
                  >
                    <ChevronLeft className="h-4 w-4 flex-shrink-0" />
                    <div className="text-left min-w-0 flex flex-col justify-center">
                      <div className="text-xs text-muted-foreground sm:hidden">
                        Previous
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        Previous
                      </div>
                      <div className="text-sm font-medium hidden sm:block">
                        {prevPage.title}
                      </div>
                    </div>
                  </Button>
                </Link>
              ) : (
                <div className="flex-1 sm:flex-initial" />
              )}

              {nextPage ? (
                <Link
                  href={nextPage.href}
                  className="flex-1 sm:flex-initial max-w-[calc(50%-0.5rem)] sm:max-w-none"
                >
                  <Button
                    variant="outline"
                    className="gap-2 w-full sm:w-auto h-full justify-end"
                  >
                    <div className="text-right min-w-0 flex flex-col justify-center">
                      <div className="text-xs text-muted-foreground sm:hidden">
                        Next
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        Next
                      </div>
                      <div className="text-sm font-medium hidden sm:block">
                        {nextPage.title}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </Button>
                </Link>
              ) : (
                <div className="flex-1 sm:flex-initial" />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
