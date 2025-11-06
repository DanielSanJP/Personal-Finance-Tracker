"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/queries/useAuth";

interface AccountRequiredModalProps {
  visible: boolean;
}

export function AccountRequiredModal({ visible }: AccountRequiredModalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, isGuest } = useAuth();

  // Don't show modal on accounts page or auth pages
  // Also don't show if user is not authenticated or still loading
  // Don't show for guest users
  const shouldShow =
    visible &&
    isAuthenticated &&
    !isLoading &&
    !isGuest &&
    pathname !== "/accounts" &&
    pathname !== "/login" &&
    pathname !== "/register" &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/register");

  const handleCreateAccount = () => {
    router.push("/accounts");
  };

  // Extra safety: don't render anything if we're not authenticated
  if (!isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Dialog open={shouldShow} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Welcome to Personal Finance Tracker! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Let&apos;s get you started on your financial journey
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-foreground text-center font-medium mb-2">
              📊 Track Your Finances
            </p>
            <p className="text-muted-foreground text-center text-sm">
              Monitor income, expenses, and reach your financial goals
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
            <p className="text-foreground text-center font-semibold mb-2">
              🏦 Create Your First Account
            </p>
            <p className="text-muted-foreground text-center text-sm">
              You need at least one account to start tracking transactions,
              budgets, and goals.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCreateAccount} className="w-full">
            Create Your First Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
