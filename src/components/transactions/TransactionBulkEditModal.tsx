import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { useUpdateTransaction } from "@/hooks/queries/useTransactions";
import { EXPENSE_CATEGORIES } from "@/constants/categories";
import { useState, useEffect } from "react";
import type { Transaction } from "@/types";

interface TransactionBulkEditModalProps {
  transactions: Transaction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionBulkEditModal({
  transactions,
  open,
  onOpenChange,
}: TransactionBulkEditModalProps) {
  const updateTransactionMutation = useUpdateTransaction();

  // Track form data for each transaction
  const [transactionForms, setTransactionForms] = useState<
    Record<
      string,
      {
        description: string;
        amount: number;
        type: string;
        category: string;
        status: string;
        merchant: string;
        date: string;
      }
    >
  >({});

  // Initialize form data when transactions change
  useEffect(() => {
    const initialForms: typeof transactionForms = {};
    transactions.forEach((transaction) => {
      initialForms[transaction.id] = {
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        type: transaction.type,
        category: transaction.category || "",
        status: transaction.status,
        merchant: transaction.merchant || "",
        date: transaction.date,
      };
    });
    setTransactionForms(initialForms);
  }, [transactions]);

  const handleInputChange = (
    transactionId: string,
    field: string,
    value: string | number
  ) => {
    setTransactionForms((prev) => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [field]: value,
      },
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await checkGuestAndWarn()) return;

    try {
      const updates = transactions
        .map((transaction) => {
          const formData = transactionForms[transaction.id];
          if (!formData) return null;

          // Convert amount to negative for expenses, positive for income
          const adjustedAmount =
            formData.type === "expense"
              ? -Math.abs(formData.amount)
              : Math.abs(formData.amount);

          return {
            id: transaction.id,
            updates: {
              description: formData.description,
              amount: adjustedAmount,
              type: formData.type as "expense" | "income",
              category: formData.category,
              status: formData.status as "completed" | "pending" | "failed",
              merchant: formData.merchant,
              date: formData.date,
              updated_at: new Date().toISOString(),
            },
          };
        })
        .filter(Boolean);

      // Update all transactions in sequence
      for (const update of updates) {
        if (update) {
          await updateTransactionMutation.mutateAsync(update);
        }
      }

      toast.success(`Successfully updated ${updates.length} transactions!`);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating transactions:", error);
      toast.error("Failed to update some transactions");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={async () => {
            if (await checkGuestAndWarn()) return;
          }}
        >
          Edit Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit All Transactions</DialogTitle>
          <DialogDescription>
            Modify your existing transactions and their details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => {
            const formData = transactionForms[transaction.id] || {};
            return (
              <div
                key={transaction.id}
                className="grid gap-3 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    {transaction.description}
                  </Label>
                  <div className="text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`desc-${transaction.id}`}>
                      Description
                    </Label>
                    <Input
                      id={`desc-${transaction.id}`}
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange(
                          transaction.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`amount-${transaction.id}`}>Amount</Label>
                    <Input
                      id={`amount-${transaction.id}`}
                      type="number"
                      step="0.01"
                      value={formData.amount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          transaction.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`category-${transaction.id}`}>
                      Category
                    </Label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={(value) =>
                        handleInputChange(transaction.id, "category", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`type-${transaction.id}`}>Type</Label>
                    <Select
                      value={formData.type || "expense"}
                      onValueChange={(value) =>
                        handleInputChange(transaction.id, "type", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`merchant-${transaction.id}`}>
                      Merchant
                    </Label>
                    <Input
                      id={`merchant-${transaction.id}`}
                      value={formData.merchant || ""}
                      onChange={(e) =>
                        handleInputChange(
                          transaction.id,
                          "merchant",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`status-${transaction.id}`}>Status</Label>
                    <Select
                      value={formData.status || "completed"}
                      onValueChange={(value) =>
                        handleInputChange(transaction.id, "status", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`date-${transaction.id}`}>Date</Label>
                  <Input
                    id={`date-${transaction.id}`}
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) =>
                      handleInputChange(transaction.id, "date", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={updateTransactionMutation.isPending}
          >
            {updateTransactionMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
