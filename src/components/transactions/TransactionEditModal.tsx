import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants/categories";
import { useState, useEffect } from "react";
import type { Transaction } from "@/types";

interface TransactionEditModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionEditModal({
  transaction,
  open,
  onOpenChange,
}: TransactionEditModalProps) {
  const updateTransactionMutation = useUpdateTransaction();

  // Form state
  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
    type: "expense" as "expense" | "income" | "transfer",
    category: "",
    status: "completed",
    party: "", // Changed from merchant to party (represents to_party for expenses, from_party for income)
    date: new Date(),
  });

  // Update form data when transaction changes
  useEffect(() => {
    if (transaction) {
      // Determine which party to show based on transaction type
      let partyValue = "";
      if (transaction.type === "expense") {
        partyValue = transaction.to_party || ""; // For expenses, show merchant (to_party)
      } else if (transaction.type === "income") {
        partyValue = transaction.from_party || ""; // For income, show source (from_party)
      } else if (transaction.type === "transfer") {
        partyValue = transaction.to_party || ""; // For transfers, show destination
      }

      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        type: transaction.type,
        // Preserve the exact category from DB, including special ones like "Goal Contribution" and "Transfer"
        category: transaction.category || "",
        status: transaction.status,
        party: partyValue,
        date: new Date(transaction.date),
      });
    }
  }, [transaction]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await checkGuestAndWarn()) return;

    if (!transaction) return;

    try {
      // Convert amount to negative for expenses, positive for income
      const adjustedAmount =
        formData.type === "expense"
          ? -Math.abs(formData.amount)
          : Math.abs(formData.amount);

      // Determine from_party and to_party based on transaction type
      let from_party = "";
      let to_party = "";

      if (formData.type === "expense") {
        from_party = transaction.from_party || "Account"; // Keep original account name
        to_party = formData.party; // Merchant
      } else if (formData.type === "income") {
        from_party = formData.party; // Income source
        to_party = transaction.to_party || "Account"; // Keep original account name
      } else if (formData.type === "transfer") {
        from_party = transaction.from_party || "Source Account";
        to_party = formData.party; // Destination
      }

      await updateTransactionMutation.mutateAsync({
        id: transaction.id,
        updates: {
          description: formData.description,
          amount: adjustedAmount,
          type: formData.type,
          category:
            formData.type === "transfer" ? "Transfer" : formData.category,
          status: formData.status as "completed" | "pending" | "failed",
          from_party,
          to_party,
          date: formData.date.toISOString(),
          updated_at: new Date().toISOString(),
        },
      });

      toast.success("Transaction updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    }
  };

  const handleInputChange = (field: string, value: string | number | Date) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Auto-set category to "Transfer" when type changes to transfer
      if (field === "type" && value === "transfer") {
        newData.category = "Transfer";
      }

      return newData;
    });
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update description, category, and other details. Amount and type
            cannot be changed to maintain balance integrity.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">
                Amount{" "}
                <span className="text-xs text-muted-foreground">
                  (read-only)
                </span>
              </Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                disabled
                className="w-full opacity-60 cursor-not-allowed"
                title="Amount cannot be edited. Delete and recreate the transaction if needed."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">
                Type{" "}
                <span className="text-xs text-muted-foreground">
                  (read-only)
                </span>
              </Label>
              <Input
                id="edit-type"
                value={
                  formData.type.charAt(0).toUpperCase() + formData.type.slice(1)
                }
                disabled
                className="w-full opacity-60 cursor-not-allowed"
                title="Type cannot be edited. Delete and recreate the transaction if needed."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              {/* Special/legacy categories that aren't in predefined lists are shown as read-only */}
              {(() => {
                const isSpecialCategory =
                  formData.category === "Transfer" ||
                  formData.category === "Goal Contribution";

                const categories =
                  formData.type === "income"
                    ? INCOME_CATEGORIES
                    : EXPENSE_CATEGORIES;

                const isInPredefinedList = categories.some(
                  (cat) => cat.name === formData.category
                );

                const isLegacyOrSpecial =
                  !isInPredefinedList && formData.category;

                return isSpecialCategory || isLegacyOrSpecial ? (
                  <Input
                    id="edit-category"
                    value={formData.category}
                    disabled
                    className="w-full opacity-60 cursor-not-allowed"
                    title={
                      isSpecialCategory
                        ? "Special categories cannot be edited"
                        : "Legacy category - cannot be edited. You can change to a standard category by selecting from the dropdown after deleting this value."
                    }
                  />
                ) : (
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      className="max-h-[300px] overflow-y-auto"
                    >
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              })()}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
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

          {/* Paid To / Received From / Transfer Destination field */}
          {formData.type !== "transfer" && (
            <div className="grid gap-2">
              <Label htmlFor="edit-party">
                {formData.type === "expense" ? "Paid To" : "Received From"}
              </Label>
              <Input
                id="edit-party"
                value={formData.party}
                onChange={(e) => handleInputChange("party", e.target.value)}
                placeholder={
                  formData.type === "expense"
                    ? "Who or where did you pay?"
                    : "Who sent you this payment?"
                }
                className="w-full"
              />
            </div>
          )}

          {formData.type === "transfer" && (
            <div className="grid gap-2">
              <Label htmlFor="edit-party">Transfer Destination</Label>
              <Input
                id="edit-party"
                value={formData.party}
                onChange={(e) => handleInputChange("party", e.target.value)}
                placeholder="Destination account or note"
                className="w-full"
              />
            </div>
          )}

          <DateTimePicker
            id="edit-date"
            date={formData.date}
            onDateTimeChange={(date) =>
              handleInputChange("date", date || new Date())
            }
            required
            showLabel
          />
        </div>
        <DialogFooter className="gap-2">
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
