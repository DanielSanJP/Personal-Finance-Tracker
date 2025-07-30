"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { getCurrentUserAccounts } from "@/lib/data";

export default function AddIncomePage() {
  const router = useRouter();
  const accounts = getCurrentUserAccounts();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [account, setAccount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const incomeSourceOptions = [
    "Salary",
    "Freelance",
    "Bonus",
    "Investment",
    "Side Business",
    "Gift",
    "Refund",
  ];

  const handleQuickAdd = (source: string) => {
    setIncomeSource(source);
    setDescription(source);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      amount,
      description,
      incomeSource,
      account,
      date,
    });
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="!px-4 !py-3"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Source of income..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="!px-4 !py-3"
                />
              </div>

              {/* Income Source */}
              <div className="space-y-2">
                <Label htmlFor="incomeSource">Income Source</Label>
                <select
                  id="incomeSource"
                  title="Select income source"
                  value={incomeSource}
                  onChange={(e) => setIncomeSource(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select income source...</option>
                  {incomeSourceOptions.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deposit to Account */}
              <div className="space-y-2">
                <Label htmlFor="account">Deposit to Account</Label>
                <select
                  id="account"
                  title="Select account to deposit to"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Select account...</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
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
                  {incomeSourceOptions.map((source) => (
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
              <div className="flex gap-4 pt-4 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-40"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-40">
                  Save
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
