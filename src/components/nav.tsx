"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/lib/data";
import Breadcrumbs from "@/components/breadcrumbs";

interface NavProps {
  showDashboardTabs?: boolean;
}

export default function Nav({ showDashboardTabs = false }: NavProps) {
  const user = getCurrentUser();
  const pathname = usePathname();

  // Function to determine if a tab is active
  const isActiveTab = (path: string) => pathname === path;

  // Function to get the correct styling for each tab
  const getTabStyles = (path: string) => {
    const baseStyles =
      "flex-1 font-medium py-2 px-2 sm:px-4 rounded-lg flex justify-center items-center cursor-pointer text-xs sm:text-sm";

    if (isActiveTab(path)) {
      return `${baseStyles} bg-white text-black border border-gray-200 hover:bg-gray-50 data-[state=open]:bg-white`;
    } else {
      return `${baseStyles} bg-transparent text-zinc-500 hover:bg-white hover:text-black data-[state=open]:bg-white data-[state=open]:text-black`;
    }
  };

  return (
    <>
      <nav className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-foreground"
              >
                <Image
                  src="/logo.svg"
                  alt="Personal Finance Tracker Logo"
                  width={64}
                  height={64}
                  className="h-12 w-12"
                />
                Personal Finance Tracker
              </Link>
            </div>
            {!showDashboardTabs && (
              <div className="flex flex-wrap items-center gap-2 md:flex-row">
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
            {showDashboardTabs && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.initials}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {user.displayName}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Help & Support</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" asChild>
                      <Link href="/">Sign Out</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showDashboardTabs && (
        <>
          <div className="bg-zinc-100 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
              <Menubar className="w-full justify-evenly border-none bg-transparent gap-1 sm:gap-2 h-auto p-0">
                <MenubarMenu>
                  <MenubarTrigger
                    asChild
                    className={getTabStyles("/dashboard")}
                  >
                    <Link href="/dashboard">Dashboard</Link>
                  </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger
                    asChild
                    className={getTabStyles("/transactions")}
                  >
                    <Link href="/transactions">Transactions</Link>
                  </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger asChild className={getTabStyles("/budgets")}>
                    <Link href="/budgets">Budgets</Link>
                  </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger asChild className={getTabStyles("/goals")}>
                    <Link href="/goals">Goals</Link>
                  </MenubarTrigger>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <Breadcrumbs />
            </div>
          </div>
        </>
      )}
    </>
  );
}
