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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateAccount, useDeleteAccount } from "@/hooks/mutations";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { Trash2 } from "lucide-react";

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
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      await updateAccountMutation.mutateAsync({
        accountId: account.id,
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        accountNumber: formData.accountNumber || undefined,
        isActive: formData.isActive,
      });

      // Toast is handled by the mutation hook
      onAccountUpdated();
      onClose();
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Error updating account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!account) return;

    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("delete accounts");
    if (isGuest) {
      setShowDeleteConfirm(false);
      return;
    }

    setIsLoading(true);

    try {
      await deleteAccountMutation.mutateAsync(account.id);

      // Toast is handled by the mutation hook
      setShowDeleteConfirm(false);
      onAccountUpdated();
      onClose();
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Error deleting account:", error);
      setShowDeleteConfirm(false);
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
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select account type..." />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                className="h-4 w-4 rounded border-border text-primary focus:ring-blue-500"
              />
              <span className="text-sm text-muted-foreground">
                {formData.isActive
                  ? "Account is active"
                  : "Account is inactive"}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="sm:mr-auto"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{account.name}&quot;? This
                action cannot be undone and will permanently remove this account
                and all associated data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
