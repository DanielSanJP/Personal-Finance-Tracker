"use client";

import Nav from "@/components/nav";
import { TransactionsList } from "@/components/transactions";
import {
  useFilteredTransactionsRpc,
  useTransactionFilterOptionsRpc,
} from "@/hooks/queries/useTransactionsRpc";
import { TransactionFilters } from "@/lib/data/transactions-rpc";
import { useState } from "react";
import TransactionsLoading from "./loading";

export default function TransactionsPage() {
  // Filter states - Start with "Last 3 Months" to show recent transactions by default
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 3 Months");
  const [selectedMerchant, setSelectedMerchant] = useState("All Merchants");
  const [selectedType, setSelectedType] = useState("All Types");

  // Build filters object
  const filters: TransactionFilters = {
    category: selectedCategory,
    period: selectedPeriod,
    merchant: selectedMerchant,
    type: selectedType,
  };

  // Fetch filtered transactions using RPC (database-side filtering)
  const {
    data: filteredTransactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useFilteredTransactionsRpc(filters);

  // Get filter options using RPC
  const {
    data: filterOptions,
    isLoading: optionsLoading,
    error: optionsError,
  } = useTransactionFilterOptionsRpc();

  // Combined loading state - show loading if either query is loading
  const isLoading = transactionsLoading || optionsLoading;
  const error = transactionsError || optionsError;

  // Extract filter options with defaults
  const categories = filterOptions?.categories || ["All Categories"];
  const merchants = filterOptions?.merchants || ["All Merchants"];
  const types = filterOptions?.types || ["All Types"];
  const periods = filterOptions?.periods || [
    "This Month",
    "Last Month",
    "Last 3 Months",
    "This Year",
    "All Time",
  ];

  // Handle loading state
  if (isLoading) {
    return <TransactionsLoading />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-red-600">
            <p>Error loading transactions:</p>
            <p className="text-sm mt-1">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />
      <TransactionsList
        transactions={filteredTransactions}
        filterOptions={{ categories, merchants, types, periods }}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedMerchant={selectedMerchant}
        setSelectedMerchant={setSelectedMerchant}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </div>
  );
}
