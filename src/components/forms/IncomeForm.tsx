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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { CategorySelect } from "@/components/category-select";
import { getIncomeCategoryNames } from "@/constants/categories";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/queries/useAccounts";
import { useCreateIncomeTransaction } from "@/hooks/queries/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { VoiceInputModal } from "@/components/voice-input-modal";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export default function IncomeForm() {
  const router = useRouter();

  // Use React Query hook for accounts
  const { data: userAccounts = [], isLoading: accountsLoading } = useAccounts();

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "__select_category__", // Category from INCOME_CATEGORIES (e.g., "Salary", "Freelance")
    incomeSource: "", // Actual company/person name (e.g., "Tech Corp Inc")
    account: "",
    date: new Date() as Date,
  });

  useEffect(() => {
    // Simply set first account as default when accounts load
    if (userAccounts.length > 0 && !formData.account) {
      setFormData((prev) => ({
        ...prev,
        account: userAccounts[0].id,
      }));
    }
  }, [userAccounts, formData.account]);

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
      } else if (field === "merchant") {
        // Use merchant as description for income
        setFormData((prev) => ({
          ...prev,
          description: value as string,
        }));
      } else if (field === "incomeSource" || field === "category") {
        setFormData((prev) => ({
          ...prev,
          incomeSource: value as string,
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

  // Use React Query mutation for creating income transactions
  const createIncomeMutation = useCreateIncomeTransaction();

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

      toast.success("Income auto-filled!", {
        description: `Confidence: ${Math.round(
          result.confidence * 100
        )}%. Review the details and save when ready.`,
      });
    },
    accounts: userAccounts,
    transactionType: "income",
  });

  const handleQuickAdd = (source: string) => {
    setFormData((prev) => ({
      ...prev,
      incomeSource: source,
      description: source,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("add income");
    if (isGuest) return;

    // Validate required fields
    if (
      !formData.amount ||
      !formData.description ||
      !formData.category ||
      !formData.incomeSource ||
      !formData.account ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields", {
        description: "All fields are required to add income.",
      });
      return;
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid positive amount.",
      });
      return;
    }

    try {
      await createIncomeMutation.mutateAsync({
        amount: Number(formData.amount),
        description: formData.description,
        category:
          formData.category === "__select_category__"
            ? undefined
            : formData.category || undefined,
        source: formData.incomeSource,
        accountId: formData.account,
        date: formData.date,
      });

      // If we get here, the transaction was created successfully
      toast.success("Income added successfully!", {
        description: `${formData.description} has been recorded.`,
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
        incomeSource: "",
        account: userAccounts.length > 0 ? userAccounts[0].id : "",
        date: new Date(),
      });

      // Navigate back to income page after a short delay
      setTimeout(() => {
        router.push("/income");
      }, 1500);
    } catch {
      toast.error("Error adding income", {
        description: "Please try again later.",
      });
    }
  };

  if (accountsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add New Income
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
              <Skeleton className="h-4 w-20" />
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
          Add New Income
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                setFormData((prev) => ({ ...prev, amount: e.target.value }))
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
              placeholder="e.g., Monthly salary, Freelance project..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          {/* Category */}
          <CategorySelect
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            type="income"
            label="Category"
            required
            className="w-full"
          />

          {/* Received From */}
          <div className="space-y-2">
            <Label htmlFor="incomeSource">
              Received From <span className="text-red-500">*</span>
            </Label>
            <Input
              id="incomeSource"
              placeholder="Who sent you this payment?"
              value={formData.incomeSource}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  incomeSource: e.target.value,
                }))
              }
            />
          </div>

          {/* Deposit to Account */}
          <div className="space-y-2">
            <Label htmlFor="account">
              Deposit to Account <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.account}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, account: value }))
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
              <p className="text-sm text-muted-foreground">
                No accounts found.{" "}
                <a
                  href="/accounts/add"
                  className="text-primary hover:underline"
                >
                  Create one first
                </a>
                .
              </p>
            )}
          </div>

          {/* Date */}
          {/* Date & Time */}
          <DateTimePicker
            id="date"
            date={formData.date}
            onDateTimeChange={(newDate) =>
              setFormData((prev) => ({
                ...prev,
                date: newDate || new Date(),
              }))
            }
            placeholder="dd/mm/yyyy"
            required
          />

          {/* Quick Add */}
          <div className="space-y-3">
            <Label>Quick Add:</Label>
            <div className="flex flex-wrap gap-2">
              {getIncomeCategoryNames().map((source) => (
                <Button
                  key={source}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(source)}
                  className="text-xs px-3 py-1"
                >
                  {source}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="w-40 min-w-32"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-40 min-w-32">
              Save
            </Button>
          </div>

          {/* Voice Input Options */}
          <div className="flex flex-wrap gap-4 justify-center mt-4">
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
              type="income"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
