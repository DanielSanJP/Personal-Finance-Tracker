"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getIncomeCategoryNames } from "@/constants/categories";
import { toast } from "sonner";
import { getCurrentUserAccounts, createIncomeTransaction } from "@/lib/data";
import { FormSkeleton } from "@/components/loading-states";
import { checkGuestAndWarn } from "@/lib/guest-protection";

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export default function AddIncomePage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accountsData = await getCurrentUserAccounts();
        setAccounts(Array.isArray(accountsData) ? accountsData : []);
      } catch (error) {
        console.error("Error loading accounts:", error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // Using standardized income categories from constants

  const handleQuickAdd = (source: string) => {
    setIncomeSource(source);
    setDescription(source);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is guest first
    const isGuest = await checkGuestAndWarn("add income");
    if (isGuest) return;

    // Validate required fields
    if (!amount || !description || !incomeSource || !account || !date) {
      toast.error("Please fill in all required fields", {
        description: "All fields are required to add income.",
      });
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid positive amount.",
      });
      return;
    }

    try {
      const result = await createIncomeTransaction({
        amount: Number(amount),
        description: description,
        source: incomeSource,
        accountId: account,
        date: date,
      });

      if (result.success) {
        toast.success("Income added successfully!", {
          description: `${description} has been recorded.`,
          action: {
            label: "Close",
            onClick: () => console.log("Closed"),
          },
        });

        // Reset form
        setAmount("");
        setDescription("");
        setIncomeSource("");
        setAccount("");
        setDate(new Date());

        // Navigate back to income page after a short delay
        setTimeout(() => {
          router.push("/income");
        }, 1500);
      }
    } catch {
      toast.error("Error adding income", {
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
              Add New Income
            </CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <FormSkeleton />
            ) : (
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    placeholder="Source of income..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Income Source */}
                <CategorySelect
                  value={incomeSource}
                  onValueChange={setIncomeSource}
                  type="income"
                  label="Income Source"
                  required
                  className="w-full"
                />

                {/* Deposit to Account */}
                <div className="space-y-2">
                  <Label htmlFor="account">
                    Deposit to Account <span className="text-red-500">*</span>
                  </Label>
                  <Select value={account} onValueChange={setAccount}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id="date"
                    date={date}
                    onDateChange={setDate}
                    placeholder="dd/mm/yyyy"
                  />
                </div>

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
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
