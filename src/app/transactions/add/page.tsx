"use client";

import { useState, useEffect, useCallback } from "react";
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
import { VoiceInputModal } from "@/components/voice-input-modal";
import { ReceiptScanModal } from "@/components/receipt-scan-modal";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useReceiptScan } from "@/hooks/useReceiptScan";

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
    date: new Date() as Date,
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userAccounts = await getCurrentUserAccounts();
        setAccounts(userAccounts);

        // Set first account as default if no account is selected and accounts exist
        if (userAccounts.length > 0 && !formData.account) {
          setFormData((prev) => ({
            ...prev,
            account: userAccounts[0].id,
          }));
        }
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
  }, [formData.account]);

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
          account: accounts.length > 0 ? accounts[0].id : "",
          status: "completed",
          date: new Date(),
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

  const handleFieldUpdate = useCallback(
    (field: string, value: string | Date) => {
      if (field === "date") {
        // Ensure we always have a valid Date object
        let dateValue: Date;
        if (value instanceof Date && !isNaN(value.getTime())) {
          dateValue = value;
        } else if (typeof value === "string") {
          const parsedDate = new Date(value);
          dateValue = !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
        } else {
          dateValue = new Date();
        }

        setFormData((prev) => ({
          ...prev,
          date: dateValue,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: value as string,
        }));
      }
    },
    []
  );

  // Continuous voice input (Expensify-style)
  const {
    isRecording: isContinuousRecording,
    isProcessing: isContinuousProcessing,
    isSupported: isVoiceSupported,
    parsedData,
    confidence,
    startListening,
    stopListening,
  } = useVoiceInput({
    onFieldUpdate: handleFieldUpdate,
    onComplete: () => {
      toast.success("Transaction auto-filled!", {
        description: "Review the details and save when ready.",
      });
    },
    accounts: accounts,
    type: "expense",
  });

  // Receipt scanning functionality
  const {
    isProcessing: isReceiptProcessing,
    isSupported: isReceiptSupported,
    parsedData: receiptParsedData,
    confidence: receiptConfidence,
    previewUrl,
    scanFromFile,
    scanFromCamera,
    captureFromVideo,
    clearPreview,
  } = useReceiptScan({
    onReceiptData: (data) => {
      // Map receipt data to form fields
      if (data.amount) {
        handleFieldUpdate("amount", data.amount);
      }
      if (data.merchant) {
        handleFieldUpdate("description", data.merchant);
        handleFieldUpdate("merchant", data.merchant);
      }
      if (data.category) {
        handleFieldUpdate("category", data.category);
      }
      if (data.date) {
        handleFieldUpdate("date", data.date);
      }

      toast.success("Receipt scanned successfully!", {
        description: "Review the auto-filled fields and save when ready.",
      });
    },
    onError: (error) => {
      console.error("Receipt scan error:", error);
    },
  });

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
                    date={
                      formData.date instanceof Date &&
                      !isNaN(formData.date.getTime())
                        ? formData.date
                        : new Date()
                    }
                    onDateChange={(date) =>
                      setFormData({ ...formData, date: date || new Date() })
                    }
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  {/* Save and Cancel Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="w-40 min-w-32"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="w-40 min-w-32">
                      Save
                    </Button>
                  </div>

                  {/* Voice Input and Scan Receipt */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <VoiceInputModal
                      isRecording={isContinuousRecording}
                      isProcessing={isContinuousProcessing}
                      isSupported={isVoiceSupported}
                      parsedData={parsedData}
                      confidence={confidence}
                      onStartListening={startListening}
                      onStopListening={stopListening}
                    />
                    <ReceiptScanModal
                      isProcessing={isReceiptProcessing}
                      isSupported={isReceiptSupported}
                      parsedData={receiptParsedData}
                      confidence={receiptConfidence}
                      previewUrl={previewUrl}
                      onScanFromFile={scanFromFile}
                      onScanFromCamera={scanFromCamera}
                      onCaptureFromVideo={captureFromVideo}
                      onClearPreview={clearPreview}
                    />
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
