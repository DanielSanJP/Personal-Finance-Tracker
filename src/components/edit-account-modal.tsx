"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateAccount } from "@/hooks/queries/useAccounts";
import { checkGuestAndWarn } from "@/lib/guest-protection";

interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: string;
  accountNumber: string;
  isActive: boolean;
}

interface EditAccountModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onAccountUpdated: () => void;
}

export function EditAccountModal({
  account,
  isOpen,
  onClose,
  onAccountUpdated,
}: EditAccountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const accountTypes = ["checking", "savings", "credit", "investment"];

  // Populate form when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        accountNumber: account.accountNumber || "",
        isActive: account.isActive,
      });
    }
  }, [account]);

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        accountNumber: account.accountNumber || "",
        isActive: account.isActive,
      });
    }
  };

  const handleSave = async () => {
    if (!account) return;

    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("edit accounts");
    if (isGuest) return;

    // Validate form data
    if (!formData.name || !formData.type || !formData.balance) {
      toast.error("Please fill in all required fields", {
        description: "Name, type, and balance are required.",
      });
      return;
    }

    if (isNaN(Number(formData.balance))) {
      toast.error("Invalid balance amount", {
        description: "Please enter a valid number for the balance.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await updateAccount(account.id, {
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        accountNumber: formData.accountNumber || undefined,
        isActive: formData.isActive,
      });

      toast.success("Account updated successfully!", {
        description: `${formData.name} has been updated.`,
      });

      onAccountUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Error updating account", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>
            Make changes to your account details here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Account Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              type="text"
              placeholder="Enter account name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          {/* Account Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-type" className="text-right">
              Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="edit-type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              aria-label="Select account type"
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select account type...</option>
              {accountTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Balance */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-balance" className="text-right">
              Balance <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          {/* Account Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-account-number" className="text-right">
              Account #
            </Label>
            <Input
              id="edit-account-number"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          {/* Active Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-active" className="text-right">
              Active
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <input
                id="edit-active"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                aria-label="Account active status"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                {formData.isActive
                  ? "Account is active"
                  : "Account is inactive"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
