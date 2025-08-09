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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface NavProps {
  showDashboardTabs?: boolean;
}

interface UserData {
  id: string;
  displayName?: string;
  display_name?: string;
  initials?: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
}

export default function Nav({ showDashboardTabs = false }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get current user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isGuest) {
      // Use guest data
      setUserData({
        id: "guest",
        displayName: "Guest User",
        initials: "GU",
        firstName: "Guest",
        lastName: "User",
      });
    } else if (user) {
      // Use authenticated user data
      setUserData({
        id: user.id,
        displayName:
          user.user_metadata?.display_name ||
          `${user.user_metadata?.first_name || ""} ${
            user.user_metadata?.last_name || ""
          }`.trim() ||
          user.email,
        initials:
          user.user_metadata?.initials ||
          `${user.user_metadata?.first_name?.[0] || ""}${
            user.user_metadata?.last_name?.[0] || ""
          }` ||
          user.email?.[0]?.toUpperCase(),
        firstName: user.user_metadata?.first_name,
        lastName: user.user_metadata?.last_name,
      });
    } else {
      setUserData(null);
    }
  }, [user, isGuest]);

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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    toast.success("Signed out successfully", {
      description: "You've been logged out of your account.",
    });
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
            {showDashboardTabs && userData && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {userData.initials}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {userData.displayName}
                        {isGuest && " (Guest)"}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isGuest && (
                      <>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Preferences</DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem>Help & Support</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleSignOut}
                    >
                      {isGuest ? "Exit Guest Mode" : "Sign Out"}
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
