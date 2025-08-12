"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import Nav from "@/components/nav";
import { getCurrentUserAccounts, createExpenseTransaction } from "@/lib/data";
import { FormSkeleton } from "@/components/loading-states";

interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: string;
  accountNumber: string;
  isActive: boolean;
}

export default function AddTransactionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    merchant: "",
    account: "",
    status: "completed",
    date: undefined as Date | undefined,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userAccounts = await getCurrentUserAccounts();
        setAccounts(userAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Error loading accounts", {
          description: "Please refresh the page to try again.",
        });
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const transactionStatuses = ["pending", "completed", "cancelled", "failed"];
  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Housing",
    "Shopping",
    "Healthcare",
    "Utilities",
    "Education",
    "Personal Care",
    "Travel",
    "Insurance",
    "Investment",
    "Other",
  ];

  const handleCancel = () => {
    router.push("/transactions");
  };

  const handleSave = async () => {
    // Validate required fields
    if (
      !formData.amount ||
      !formData.description ||
      !formData.account ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields", {
        description: "Amount, description, account, and date are required.",
      });
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid positive number for the amount.",
      });
      return;
    }

    try {
      const result = await createExpenseTransaction({
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category || undefined,
        merchant: formData.merchant || undefined,
        accountId: formData.account,
        status: formData.status,
        date: formData.date,
      });

      if (result.success) {
        toast.success("Expense saved successfully!", {
          description: "Your expense has been recorded.",
          action: {
            label: "Close",
            onClick: () => console.log("Closed"),
          },
        });

        // Reset form
        setFormData({
          amount: "",
          description: "",
          category: "",
          merchant: "",
          account: "",
          status: "completed",
          date: undefined,
        });

        // Navigate back to transactions page after a short delay
        setTimeout(() => {
          router.push("/transactions");
        }, 1500);
      }
    } catch {
      toast.error("Error saving expense", {
        description: "Please try again later.",
      });
    }
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
              Add New Expense
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {loadingAccounts ? (
              <FormSkeleton />
            ) : (
              <>
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-base font-medium">
                    Amount <span className="text-red-500">*</span>
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
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description <span className="text-red-500">*</span>
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
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Merchant (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="merchant" className="text-base font-medium">
                    Merchant (Optional)
                  </Label>
                  <Input
                    id="merchant"
                    type="text"
                    placeholder="Where was this transaction made?"
                    value={formData.merchant}
                    onChange={(e) =>
                      setFormData({ ...formData, merchant: e.target.value })
                    }
                    className="!h-auto !px-4 !py-3 !border-gray-300 !rounded-lg !bg-white !text-gray-600 focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-blue-500"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-medium">
                    Status
                  </Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    aria-label="Select transaction status"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {transactionStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <Label htmlFor="account" className="text-base font-medium">
                    Account <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="account"
                    value={formData.account}
                    onChange={(e) =>
                      setFormData({ ...formData, account: e.target.value })
                    }
                    aria-label="Select account"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    disabled={loadingAccounts}
                  >
                    <option value="">
                      {loadingAccounts
                        ? "Loading accounts..."
                        : "Select account..."}
                    </option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </option>
                    ))}
                  </select>
                  {accounts.length === 0 && !loadingAccounts && (
                    <p className="text-sm text-gray-500">
                      No accounts found.{" "}
                      <a
                        href="/accounts/add"
                        className="text-blue-600 hover:underline"
                      >
                        Create one first
                      </a>
                      .
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium">
                    Date <span className="text-red-500">*</span>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
