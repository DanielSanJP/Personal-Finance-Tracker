"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getCurrentUserTransactions, formatCurrency } from "@/lib/data";
import Nav from "@/components/nav";

interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  merchant: string;
  status: string;
}

export default function TransactionsPage() {
  const transactions = getCurrentUserTransactions();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Get unique categories for filter
  const categories = [
    "All Categories",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];
  const periods = ["This Month", "Last Month", "Last 3 Months", "This Year"];

  // Helper function to check if date is within period
  const isDateInPeriod = (dateString: string, period: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (period) {
      case "This Month":
        return (
          date.getFullYear() === currentYear && date.getMonth() === currentMonth
        );
      case "Last Month":
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear =
          currentMonth === 0 ? currentYear - 1 : currentYear;
        return (
          date.getFullYear() === lastMonthYear && date.getMonth() === lastMonth
        );
      case "Last 3 Months":
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(currentMonth - 3);
        return date >= threeMonthsAgo;
      case "This Year":
        return date.getFullYear() === currentYear;
      default:
        return true;
    }
  };

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    // Category filter
    if (
      selectedCategory !== "All Categories" &&
      transaction.category !== selectedCategory
    ) {
      return false;
    }

    // Period filter
    return isDateInPeriod(transaction.date, selectedPeriod);
  });

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAmountColor = (type: string) => {
    if (type === "income") return "text-green-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Transaction History
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Filter Controls */}
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Filter by category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  aria-label="Filter by time period"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {periods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg px-2"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {transaction.description}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {transaction.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${getAmountColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction Detail Modal */}
            <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogDescription>
                    Complete information about this transaction.
                  </DialogDescription>
                </DialogHeader>
                {selectedTransaction && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Description
                      </Label>
                      <p className="text-base font-semibold">
                        {selectedTransaction.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Amount
                        </Label>
                        <p
                          className={`text-lg font-bold ${getAmountColor(
                            selectedTransaction.type
                          )}`}
                        >
                          {selectedTransaction.type === "income" ? "+" : "-"}
                          {formatCurrency(Math.abs(selectedTransaction.amount))}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Type
                        </Label>
                        <p className="text-base capitalize">
                          {selectedTransaction.type}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Category
                        </Label>
                        <p className="text-base">
                          {selectedTransaction.category}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-medium text-gray-600">
                          Status
                        </Label>
                        <p className="text-base capitalize">
                          {selectedTransaction.status}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Merchant
                      </Label>
                      <p className="text-base">
                        {selectedTransaction.merchant}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Date
                      </Label>
                      <p className="text-base">
                        {formatFullDate(selectedTransaction.date)}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-sm font-medium text-gray-600">
                        Transaction ID
                      </Label>
                      <p className="text-sm text-gray-500 font-mono">
                        {selectedTransaction.id}
                      </p>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDetailModalOpen(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <Button
                asChild
                className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg font-semibold"
              >
                <Link href="/transactions/add">Add Transaction</Link>
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 py-4 text-base font-semibold border-gray-300"
                >
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-4 text-base font-semibold border-gray-300"
                >
                  Advanced Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
