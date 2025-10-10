"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbsProps {
  className?: string;
}

export default function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page, login, or register
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  // Split the pathname into segments
  const pathSegments = pathname.split("/").filter(Boolean);

  // Helper function to get label for "add" segment based on parent context
  const getAddLabel = (parentSegment: string | undefined) => {
    switch (parentSegment) {
      case "accounts":
        return "Add Account";
      case "income":
        return "Add Income";
      case "budgets":
        return "Add Budget";
      case "goals":
        return "Add Goal";
      case "transactions":
      default:
        return "Add Transaction";
    }
  };

  // Map of path segments to display names
  const segmentLabels: Record<string, string> = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    accounts: "Accounts",
    income: "Income",
    budgets: "Budgets",
    goals: "Goals",
    reports: "Reports",
    "budget-report": "Budget Report",
    "spending-report": "Spending Report",
  };

  // Build breadcrumb items
  const breadcrumbItems = [];

  // Always start with Dashboard as the home for authenticated pages
  breadcrumbItems.push(
    <BreadcrumbItem key="dashboard">
      <BreadcrumbLink asChild>
        <Link href="/dashboard">Dashboard</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  // Add segments if not already on dashboard
  if (pathname !== "/dashboard") {
    // Special handling for reports page to show Dashboard > Reports
    if (pathname === "/reports") {
      breadcrumbItems.push(<BreadcrumbSeparator key="sep-reports" />);
      breadcrumbItems.push(
        <BreadcrumbItem key="reports">
          <BreadcrumbPage>Reports</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      // Default breadcrumb logic for other pages
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === pathSegments.length - 1;

        // Special handling for "add" segment - get label based on parent context
        let label: string;
        if (segment === "add") {
          const parentSegment = index > 0 ? pathSegments[index - 1] : undefined;
          label = getAddLabel(parentSegment);
        } else {
          label =
            segmentLabels[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);
        }

        // Skip dashboard since we already added it
        if (segment === "dashboard") return;

        breadcrumbItems.push(<BreadcrumbSeparator key={`sep-${index}`} />);

        if (isLast) {
          // Last item is not a link
          breadcrumbItems.push(
            <BreadcrumbItem key={segment}>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          );
        } else {
          breadcrumbItems.push(
            <BreadcrumbItem key={segment}>
              <BreadcrumbLink asChild>
                <Link href={currentPath}>{label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        }
      });
    }
  }

  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
