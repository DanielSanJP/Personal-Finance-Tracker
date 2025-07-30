"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import Nav from "@/components/nav";

export default function AddTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    description: "",
    category: "",
    account: "",
    date: undefined as Date | undefined,
  });

  const transactionTypes = ["income", "expense", "transfer"];
  const categories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Housing",
    "Income",
    "Transfer",
    "Shopping",
    "Healthcare",
    "Utilities",
  ];
  const accounts = ["Everyday Account", "Savings Account", "Emergency Fund"];

  const handleCancel = () => {
    router.push("/transactions");
  };

  const handleSave = () => {
    // Non-functional for now - just show a toast
    toast.success("Transaction saved successfully!", {
      description: "Your transaction has been recorded.",
      action: {
        label: "Close",
        onClick: () => console.log("Closed"),
      },
    });
  };

  const handleVoiceInput = () => {
    toast("Voice Input functionality not implemented yet", {
      description: "This feature will be available in a future update.",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    });
  };

  const handleScanReceipt = () => {
    toast("Scan Receipt functionality not implemented yet", {
      description: "This feature will be available in a future update.",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Add New Transaction
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-medium">
                Type
              </Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                aria-label="Select transaction type"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select type...</option>
                {transactionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="What was this for?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category
              </Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                aria-label="Select transaction category"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select category...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Account */}
            <div className="space-y-2">
              <Label htmlFor="account" className="text-base font-medium">
                Account
              </Label>
              <select
                id="account"
                value={formData.account}
                onChange={(e) =>
                  setFormData({ ...formData, account: e.target.value })
                }
                aria-label="Select account"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select account...</option>
                {accounts.map((account) => (
                  <option key={account} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-medium">
                Date
              </Label>
              <DatePicker
                id="date"
                date={formData.date}
                onDateChange={(date) => setFormData({ ...formData, date })}
                placeholder="dd/mm/yyyy"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              {/* Save and Cancel Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-40"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="w-40">
                  Save
                </Button>
              </div>

              {/* Voice Input and Scan Receipt */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleVoiceInput}
                  variant="outline"
                  className="w-40"
                >
                  Voice Input
                </Button>
                <Button
                  onClick={handleScanReceipt}
                  variant="outline"
                  className="w-40"
                >
                  Scan Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
