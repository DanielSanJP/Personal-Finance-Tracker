"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useCreateAccount } from "@/hooks/mutations";
import { checkGuestAndWarn } from "@/lib/guest-protection";

export default function AccountForm() {
  const router = useRouter();
  const createAccountMutation = useCreateAccount();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "0",
    accountNumber: "",
  });

  const accountTypes = ["checking", "savings", "credit", "investment"];

  const handleCancel = () => {
    router.push("/accounts");
  };

  const handleSave = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("create accounts");
    if (isGuest) return;

    // Validate form data
    if (!formData.name || !formData.type) {
      toast.error("Please fill in all required fields", {
        description: "Name and type are required.",
      });
      return;
    }

    // Use 0 as default if balance is empty
    const balanceValue =
      formData.balance.trim() === "" ? "0" : formData.balance;

    if (isNaN(Number(balanceValue))) {
      toast.error("Invalid balance amount", {
        description: "Please enter a valid number for the balance.",
      });
      return;
    }

    try {
      await createAccountMutation.mutateAsync({
        name: formData.name,
        type: formData.type,
        balance: Number(balanceValue),
        accountNumber: formData.accountNumber || undefined,
      });

      // If we get here, the account was created successfully
      // Toast is handled by the mutation hook

      // Reset form
      setFormData({
        name: "",
        type: "",
        balance: "0",
        accountNumber: "",
      });

      // Navigate back to accounts page after a short delay
      setTimeout(() => {
        router.push("/accounts");
      }, 1500);
    } catch (error) {
      // Error toast is handled by the mutation hook
      console.error("Error creating account:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Add New Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Account Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Account Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter account name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Account Type */}
        <div className="space-y-2">
          <Label htmlFor="type">
            Account Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full">
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

        {/* Initial Balance */}
        <div className="space-y-2">
          <Label htmlFor="balance">
            Initial Balance <span className="text-red-500">*</span>
          </Label>
          <Input
            id="balance"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.balance}
            onChange={(e) =>
              setFormData({ ...formData, balance: e.target.value })
            }
          />
        </div>

        {/* Account Number (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number (Optional)</Label>
          <Input
            id="accountNumber"
            type="text"
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-40 min-w-32"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-40 min-w-32">
              Create Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
