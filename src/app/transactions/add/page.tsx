"use client";

import { useState, useEffect } from "react";
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
import { DatePicker } from "@/components/ui/date-picker";
import { CategorySelect } from "@/components/category-select";
import { toast } from "sonner";
import Nav from "@/components/nav";
import { getCurrentUserAccounts, createExpenseTransaction } from "@/lib/data";
import { FormSkeleton } from "@/components/loading-states";
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

  // Using standardized categories from constants

  const handleCancel = () => {
    router.push("/transactions");
  };

  const handleSave = async () => {
    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("create transactions");
    if (isGuest) return;

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

          <CardContent>
            {loadingAccounts ? (
              <FormSkeleton />
            ) : (
              <div className="space-y-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">
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
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
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
                  />
                </div>

                {/* Category */}
                <CategorySelect
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  type="expense"
                  required
                  className="w-full"
                />

                {/* Merchant (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="merchant">Merchant (Optional)</Label>
                  <Input
                    id="merchant"
                    type="text"
                    placeholder="Where was this transaction made?"
                    value={formData.merchant}
                    onChange={(e) =>
                      setFormData({ ...formData, merchant: e.target.value })
                    }
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <Label htmlFor="account">
                    Account <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.account}
                    onValueChange={(value) =>
                      setFormData({ ...formData, account: value })
                    }
                    disabled={loadingAccounts}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          loadingAccounts
                            ? "Loading accounts..."
                            : "Select account..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="date">
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
                <div className="pt-4 space-y-3">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
