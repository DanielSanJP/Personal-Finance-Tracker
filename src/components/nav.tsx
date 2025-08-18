"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import Breadcrumbs from "@/components/breadcrumbs";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { clearUserCache } from "@/lib/data/auth";
import { dataCache } from "@/lib/data/cache";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { GUEST_USER_ID } from "@/lib/guest-protection";

interface NavProps {
  showDashboardTabs?: boolean;
}

export default function Nav({ showDashboardTabs = false }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Simplified logic for when to show different nav elements
  const hasUser = !!user && !loading;

  // Check if current user is guest
  const isGuestUser = user?.id === GUEST_USER_ID;

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

  // Create userData from user
  const userData =
    hasUser && user
      ? {
          id: user.id,
          displayName: isGuestUser
            ? "Guest User (View Only)"
            : user.user_metadata?.display_name || user.email || "User",
          initials: isGuestUser
            ? "G"
            : user.user_metadata?.initials ||
              `${user.user_metadata?.first_name?.[0] || ""}${
                user.user_metadata?.last_name?.[0] || ""
              }`.toUpperCase() ||
              user.email?.[0]?.toUpperCase() ||
              "U",
        }
      : null;

  const handleSignOut = async () => {
    try {
      const supabase = createClient();

      // Clear all cached data first
      dataCache.clearAll();
      clearUserCache();

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Redirect to login
      router.push("/login");

      toast.success("Signed out successfully", {
        description: "You've been logged out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out", {
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  return (
    <>
      <nav className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b">
          <div className="flex justify-between h-16">
            <div className="flex items-center min-w-0 flex-1">
              {hasUser ? (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm sm:text-xl font-bold text-foreground hover:opacity-80 transition-opacity min-w-0"
                >
                  <Image
                    src="/logo.svg"
                    alt="Personal Finance Tracker Logo"
                    width={64}
                    height={64}
                    className="h-12 w-12 sm:h-12 sm:w-12 flex-shrink-0"
                  />
                  <span className="hidden sm:inline truncate">
                    Personal Finance Tracker
                  </span>
                </Link>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm sm:text-xl font-bold text-foreground min-w-0"
                >
                  <Image
                    src="/logo.svg"
                    alt="Personal Finance Tracker Logo"
                    width={64}
                    height={64}
                    className="h-12 w-12 sm:h-12 sm:w-12 flex-shrink-0"
                  />
                  <span className="hidden sm:inline truncate">
                    Personal Finance Tracker
                  </span>
                </Link>
              )}
            </div>
            {!showDashboardTabs && (
              <div className="flex flex-wrap items-center gap-2 md:flex-row flex-shrink-0">
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
            {showDashboardTabs && userData && (
              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-1 sm:gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-1 sm:p-2 transition-colors">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {userData.initials}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 truncate">
                        {userData.displayName}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/accounts" className="cursor-pointer">
                        Bank Accounts
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reports" className="cursor-pointer">
                        View Reports
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/preferences" className="cursor-pointer">
                        Preferences
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="cursor-pointer">
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleSignOut}
                    >
                      Sign Out
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
