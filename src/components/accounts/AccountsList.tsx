"use client";

import { useState } from "react";
import { useAccounts } from "@/hooks/queries/useAccounts";
import { EditAccountModal } from "@/components/edit-account-modal";
import { AccountCard } from "./AccountCard";
import { AccountsHeader } from "./AccountsHeader";
import { AccountsEmptyState } from "./AccountsEmptyState";
import { TransferModal } from "./TransferModal";
import type { Account } from "@/types";

export function AccountsList() {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [transferSourceAccount, setTransferSourceAccount] = useState<
    Account | undefined
  >(undefined);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const { data: accounts = [], isError, error, refetch } = useAccounts();

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  const handleTransferAccount = (account: Account) => {
    setTransferSourceAccount(account);
    setIsTransferModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAccount(null);
  };

  const handleAccountUpdated = async () => {
    // Refresh the accounts list using React Query
    await refetch();
  };

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AccountsHeader />
        <div className="text-center text-red-600">
          <p>Error loading accounts:</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <AccountsHeader />

      {accounts.length === 0 ? (
        <AccountsEmptyState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={handleEditAccount}
              onTransfer={handleTransferAccount}
            />
          ))}
        </div>
      )}

      {/* Edit Account Modal */}
      <EditAccountModal
        account={editingAccount}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onAccountUpdated={handleAccountUpdated}
      />

      {/* Transfer Modal */}
      <TransferModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
        sourceAccount={transferSourceAccount}
      />
    </div>
  );
}
