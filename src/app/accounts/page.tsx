"use client";

import { AccountsList } from "@/components/accounts";
import { useAccounts } from "@/hooks/queries";
import AccountsLoading from "./loading";

export default function AccountsPage() {
  const { error, isLoading } = useAccounts();

  if (isLoading) {
    return <AccountsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccountsList />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AccountsList />
    </div>
  );
}
