import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Breadcrumbs from "@/components/breadcrumbs";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface NavProps {
  showDashboardTabs?: boolean;
}

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function Nav({ showDashboardTabs = false }: NavProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile data if user exists
  let userData = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    userData = profile;
  }

  const displayName =
    userData?.display_name ||
    userData?.displayName ||
    (userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : user?.email || "User");

  const initials =
    userData?.initials ||
    (userData?.first_name && userData?.last_name
      ? `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
      : user?.email?.[0]?.toUpperCase() || "U");

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-gray-900"
          >
            Personal Finance Tracker
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {initials}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <form action={signOut}>
                    <button type="submit" className="w-full">
                      <DropdownMenuItem>Sign out</DropdownMenuItem>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {showDashboardTabs && user && (
        <>
          <div className="border-b bg-gray-50">
            <div className="flex h-12 items-center px-4">
              <div className="flex space-x-8">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Overview
                </Link>
                <Link
                  href="/transactions"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Transactions
                </Link>
                <Link
                  href="/goals"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Goals
                </Link>
                <Link
                  href="/budgets"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Budgets
                </Link>
                <Link
                  href="/income"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Income
                </Link>
              </div>
            </div>
          </div>
          <Breadcrumbs />
        </>
      )}
    </nav>
  );
}
