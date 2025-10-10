"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CategorySelect } from "@/components/category-select";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/queries/useAccounts";
import { useCreateExpenseTransaction } from "@/hooks/queries/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { VoiceInputModal } from "@/components/voice-input-modal";
import { ReceiptScanModal } from "@/components/receipt-scan-modal";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useReceiptScan } from "@/hooks/useReceiptScan";

export default function TransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasSetDefaultAccount, setHasSetDefaultAccount] = useState(false);

  // Check if we should auto-open the scan receipt modal
  const shouldAutoScanReceipt = searchParams.get("scan") === "true";

  // Use React Query hook for accounts
  const { data: userAccounts = [], isLoading: accountsLoading } = useAccounts();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "__select_category__",
    merchant: "",
    account: "",
    status: "completed",
    date: new Date() as Date,
  });

  useEffect(() => {
    // Set first account as default if no account is selected and accounts exist
    if (userAccounts.length > 0 && !formData.account && !hasSetDefaultAccount) {
      setFormData((prev) => ({
        ...prev,
        account: userAccounts[0].id,
      }));
      setHasSetDefaultAccount(true);
    }
  }, [userAccounts, formData.account, hasSetDefaultAccount]);

  // Clear the scan query parameter after component mounts to prevent auto-opening on refresh
  useEffect(() => {
    if (shouldAutoScanReceipt) {
      const url = new URL(window.location.href);
      url.searchParams.delete("scan");
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [shouldAutoScanReceipt, router]);

  // Use React Query mutation for creating transactions
  const createExpenseMutation = useCreateExpenseTransaction();

  const transactionStatuses = ["pending", "completed", "cancelled", "failed"];

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
      !formData.merchant ||
      !formData.account ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields", {
        description:
          "Amount, description, paid to, account, and date are required.",
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
      await createExpenseMutation.mutateAsync({
        amount: Number(formData.amount),
        description: formData.description,
        category:
          formData.category === "__select_category__"
            ? undefined
            : formData.category || undefined,
        merchant: formData.merchant || undefined,
        accountId: formData.account,
        status: formData.status,
        date: formData.date,
      });

      // If we get here, the transaction was created successfully
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
        category: "__select_category__",
        merchant: "",
        account: userAccounts.length > 0 ? userAccounts[0].id : "",
        status: "completed",
        date: new Date(),
      });

      // Navigate back to transactions page after a short delay
      setTimeout(() => {
        router.push("/transactions");
      }, 1500);
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
    startVoiceInput,
    stopVoiceInput,
  } = useVoiceInput({
    onResult: (result) => {
      // Map voice input result to form fields
      if (result.amount) {
        handleFieldUpdate("amount", result.amount);
      }
      if (result.description) {
        handleFieldUpdate("description", result.description);
      }
      if (result.merchant) {
        handleFieldUpdate("merchant", result.merchant);
      }
      if (result.category) {
        handleFieldUpdate("category", result.category);
      }
      if (result.account) {
        // Find account by name and set its ID
        const matchedAccount = userAccounts.find(
          (acc) => acc.name === result.account
        );
        if (matchedAccount) {
          handleFieldUpdate("account", matchedAccount.id);
        }
      }
      if (result.date) {
        handleFieldUpdate("date", new Date(result.date));
      }

      toast.success("Transaction auto-filled!", {
        description: `Confidence: ${Math.round(
          result.confidence * 100
        )}%. Review the details and save when ready.`,
      });
    },
    accounts: userAccounts,
    transactionType: "expense",
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

  if (accountsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Add New Expense
        </CardTitle>
      </CardHeader>

      <CardContent>
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

          {/* Paid To */}
          <div className="space-y-2">
            <Label htmlFor="merchant">
              Paid To <span className="text-red-500">*</span>
            </Label>
            <Input
              id="merchant"
              type="text"
              placeholder="Who or where did you pay?"
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
              disabled={accountsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    accountsLoading
                      ? "Loading accounts..."
                      : "Select account..."
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {userAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userAccounts.length === 0 && !accountsLoading && (
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

          {/* Date & Time */}
          <DateTimePicker
            id="date"
            date={
              formData.date instanceof Date && !isNaN(formData.date.getTime())
                ? formData.date
                : new Date()
            }
            onDateTimeChange={(date) =>
              setFormData({ ...formData, date: date || new Date() })
            }
            placeholder="dd/mm/yyyy"
            required
          />

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
                parsedData={
                  parsedData
                    ? {
                        amount: parsedData.amount,
                        description: parsedData.description,
                        merchant: parsedData.merchant,
                        category: parsedData.category,
                        account: parsedData.account,
                        date: parsedData.date
                          ? new Date(parsedData.date)
                          : undefined,
                      }
                    : undefined
                }
                confidence={confidence}
                onStartListening={startVoiceInput}
                onStopListening={stopVoiceInput}
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
                autoOpen={shouldAutoScanReceipt}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
