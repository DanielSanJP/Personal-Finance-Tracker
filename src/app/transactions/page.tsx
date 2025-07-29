"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUserTransactions, formatCurrency } from "@/lib/data";
import Nav from "@/components/nav";

export default function TransactionsPage() {
  const transactions = getCurrentUserTransactions();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Get unique categories for filter
  const categories = [
    "All Categories",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];
  const periods = ["This Month", "Last Month", "Last 3 Months", "This Year"];

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    if (
      selectedCategory !== "All Categories" &&
      transaction.category !== selectedCategory
    ) {
      return false;
    }
    // For now, we'll show all transactions regardless of period
    // You can add date filtering logic here based on selectedPeriod
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
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
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
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
