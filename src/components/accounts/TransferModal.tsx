"use client";

import { useState, FormEvent, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccounts } from "@/hooks/queries/useAccounts";
import { createClient } from "@/lib/supabase/client";
import type { Account } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceAccount?: Account;
}

export function TransferModal({
  open,
  onOpenChange,
  sourceAccount,
}: TransferModalProps) {
  const { data: accounts = [] } = useAccounts();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("Account transfer");

  // Set source account when provided or modal opens
  useEffect(() => {
    if (open && sourceAccount) {
      setFromAccountId(sourceAccount.id);
    }
  }, [open, sourceAccount]);

  const fromAccount = accounts.find((a) => a.id === fromAccountId);
  const toAccount = accounts.find((a) => a.id === toAccountId);

  const availableDestinations = accounts.filter(
    (a) => a.id !== fromAccountId && a.isActive
  );

  const activeAccounts = accounts.filter((a) => a.isActive);

  const resetForm = () => {
    setFromAccountId(sourceAccount?.id || "");
    setToAccountId("");
    setAmount("");
    setDescription("Account transfer");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);

    if (!fromAccountId || !toAccountId) {
      toast.error("Please select both source and destination accounts");
      return;
    }

    if (fromAccountId === toAccountId) {
      toast.error("Cannot transfer to the same account");
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Transfer amount must be greater than zero");
      return;
    }

    if (fromAccount && amountNum > fromAccount.balance) {
      toast.error(
        `Insufficient funds. Available balance: ${formatCurrency(
          fromAccount.balance
        )}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const fromName = fromAccount?.name || "Account";
      const toName = toAccount?.name || "Account";

      // Generate transaction ID
      const transactionId = `txn_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create transfer transaction - trigger handles balance updates
      const { error } = await supabase.from("transactions").insert({
        id: transactionId,
        user_id: user.id,
        account_id: fromAccountId,
        destination_account_id: toAccountId,
        type: "transfer",
        amount: -Math.abs(amountNum), // Negative: money leaving source
        description: description || "Account transfer",
        category: "Transfer",
        from_party: fromName,
        to_party: toName,
        date: new Date().toISOString(),
        status: "completed",
      });

      if (error) {
        console.error("Transfer error:", error);
        throw new Error(`Failed to create transfer: ${error.message}`);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });

      toast.success(
        `Successfully transferred ${formatCurrency(
          amountNum
        )} from ${fromName} to ${toName}`
      );

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to transfer funds"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const amountNum = parseFloat(amount) || 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Transfer money between your accounts. The transaction will be
            recorded automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Account */}
          <div className="space-y-2">
            <Label htmlFor="fromAccountId">
              From Account <span className="text-red-500">*</span>
            </Label>
            <Select
              value={fromAccountId}
              onValueChange={setFromAccountId}
              disabled={!!sourceAccount}
            >
              <SelectTrigger id="fromAccountId">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{account.name}</span>
                      <span className="text-sm text-gray-500 ml-4">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromAccount && (
              <p className="text-sm text-gray-500">
                Available: {formatCurrency(fromAccount.balance)}
              </p>
            )}
          </div>

          {/* To Account */}
          <div className="space-y-2">
            <Label htmlFor="toAccountId">
              To Account <span className="text-red-500">*</span>
            </Label>
            <Select
              value={toAccountId}
              onValueChange={setToAccountId}
              disabled={!fromAccountId}
            >
              <SelectTrigger id="toAccountId">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {availableDestinations.length > 0 ? (
                  availableDestinations.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{account.name}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {formatCurrency(account.balance)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No other active accounts available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="Add a note about this transfer"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Summary */}
          {fromAccount && toAccount && amountNum > 0 && (
            <div
              className={`p-4 rounded-lg space-y-2 ${
                amountNum > fromAccount.balance
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-50"
              }`}
            >
              <h4 className="font-semibold text-sm">Transfer Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{fromAccount.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{toAccount.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(amountNum)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xs">
                    <span>New balance in {fromAccount.name}:</span>
                    <span
                      className={
                        fromAccount.balance - amountNum < 0
                          ? "text-red-600 font-bold"
                          : "font-medium"
                      }
                    >
                      {formatCurrency(fromAccount.balance - amountNum)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>New balance in {toAccount.name}:</span>
                    <span>{formatCurrency(toAccount.balance + amountNum)}</span>
                  </div>
                </div>
              </div>

              {/* Insufficient Funds Warning */}
              {amountNum > fromAccount.balance && (
                <div className="bg-red-100 border border-red-300 rounded-md p-3 mt-2">
                  <p className="text-sm font-semibold text-red-800">
                    ⚠️ Insufficient Funds
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    The transfer amount exceeds the available balance by{" "}
                    <span className="font-bold">
                      {formatCurrency(amountNum - fromAccount.balance)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !fromAccountId ||
                !toAccountId ||
                amountNum <= 0 ||
                (fromAccount && amountNum > fromAccount.balance)
              }
            >
              {isSubmitting ? "Transferring..." : "Transfer Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
