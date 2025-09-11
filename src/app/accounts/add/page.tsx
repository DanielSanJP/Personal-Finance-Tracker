"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Nav from "@/components/nav";
import { createAccount } from "@/hooks/queries/useAccounts";
import { checkGuestAndWarn } from "@/lib/guest-protection";

export default function AddAccountPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
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

    try {
      await createAccount({
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        accountNumber: formData.accountNumber || undefined,
      });

      // If we get here, the account was created successfully
      toast.success("Account created successfully!", {
        description: `${formData.name} has been added to your accounts.`,
        action: {
          label: "Close",
          onClick: () => console.log("Closed"),
        },
      });

      // Reset form
      setFormData({
        name: "",
        type: "",
        balance: "",
        accountNumber: "",
      });

      // Navigate back to accounts page after a short delay
      setTimeout(() => {
        router.push("/accounts");
      }, 1500);
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error creating account", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Add New Account
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter account name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
              />
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-medium">
                Account Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                aria-label="Select account type"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select account type...</option>
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Initial Balance */}
            <div className="space-y-2">
              <Label htmlFor="balance" className="text-base font-medium">
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
                className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
              />
            </div>

            {/* Account Number (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-base font-medium">
                Account Number (Optional)
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
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
      </div>
    </div>
  );
}
