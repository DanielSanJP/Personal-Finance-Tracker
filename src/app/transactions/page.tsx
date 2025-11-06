"use client";

import { TransactionsList } from "@/components/transactions";
import {
  useFilteredTransactions,
  useTransactionFilterOptions,
  TransactionFilters,
} from "@/hooks/queries/useTransactions";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import TransactionsLoading from "./loading";
import { useAccountCheck } from "@/hooks/useAccountCheck";
import { AccountRequiredModal } from "@/components/account-required-modal";
import { useAuth } from "@/hooks/queries/useAuth";

export default function TransactionsPage() {
  // Filter states - Start with "This Month" to show current month transactions by default
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedParty, setSelectedParty] = useState("All Parties");
  const [selectedType, setSelectedType] = useState("All Types");

  // Check if user has accounts
  const { hasAccounts, isLoading: accountsLoading } = useAccountCheck();
  const { isAuthenticated } = useAuth();

  // Build filters object WITHOUT party filter first (to get all parties from filtered transactions)
  const preFilters: TransactionFilters = {
    category: selectedCategory,
    period: selectedPeriod,
    party: "All Parties", // Don't apply party filter yet
    type: selectedType,
  };

  // Fetch pre-filtered transactions (without party filter)
  const {
    data: preFilteredTransactions = [],
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useFilteredTransactions(preFilters);

  // Get filter options using RPC
  const {
    data: filterOptions,
    isLoading: optionsLoading,
    error: optionsError,
  } = useTransactionFilterOptions();

  // Combined loading state - show loading if either query is loading
  const isLoading = transactionsLoading || optionsLoading || accountsLoading;
  const error = transactionsError || optionsError;

  // Extract filter options with defaults
  const categories = filterOptions?.categories || ["All Categories"];
  const types = filterOptions?.types || ["All Types"];
  const periods = filterOptions?.periods || [
    "This Month",
    "Last Month",
    "Last 3 Months",
    "This Year",
    "All Time",
  ];

  // Calculate party spending/earnings from pre-filtered transactions
  const partyAmounts = new Map<string, { amount: number; type: string }>();
  preFilteredTransactions.forEach((t) => {
    const parties = [t.from_party, t.to_party].filter(Boolean);
    parties.forEach((party) => {
      if (party) {
        const current = partyAmounts.get(party) || { amount: 0, type: "" };
        // For expenses, to_party gets negative (money out)
        // For income, from_party gets positive (money in)
        // For transfers, track separately with special symbol
        if (t.type === "expense" && party === t.to_party) {
          partyAmounts.set(party, {
            amount: current.amount + Number(t.amount), // Store as positive, will negate in display
            type: "expense",
          });
        } else if (t.type === "income" && party === t.from_party) {
          partyAmounts.set(party, {
            amount: current.amount + Number(t.amount),
            type: "income",
          });
        } else if (t.type === "transfer" && party === t.to_party) {
          partyAmounts.set(party, {
            amount: current.amount + Number(t.amount),
            type: "transfer",
          });
        }
      }
    });
  });

  // Sort parties by amount (highest spending/earning first)
  const sortedPartyEntries = Array.from(partyAmounts.entries()).sort(
    (a, b) => b[1].amount - a[1].amount
  );

  // Format party list with amounts
  const parties = [
    "All Parties",
    ...sortedPartyEntries.map(([party, { amount, type }]) => {
      // Use absolute value to avoid doubling minus signs
      const formattedAmount = formatCurrency(Math.abs(amount));
      // Use different symbols based on transaction type
      let displayAmount = "";
      if (type === "expense") {
        displayAmount = `-${formattedAmount}`; // Expenses are money out
      } else if (type === "income") {
        displayAmount = `+${formattedAmount}`; // Income is money in
      } else if (type === "transfer") {
        displayAmount = `→${formattedAmount}`; // Transfers use arrow symbol
      }
      return `${party} (${displayAmount})`;
    }),
  ];

  // Apply party filter to get final filtered transactions
  const filteredTransactions =
    selectedParty === "All Parties"
      ? preFilteredTransactions
      : preFilteredTransactions.filter((t) => {
          // Extract party name from formatted string like "BP (-$100.00)"
          const partyName = selectedParty.includes(" (")
            ? selectedParty.substring(0, selectedParty.indexOf(" ("))
            : selectedParty;
          return t.from_party === partyName || t.to_party === partyName;
        });

  // Handle loading state
  if (isLoading) {
    return <TransactionsLoading />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <AccountRequiredModal visible={isAuthenticated && !hasAccounts} />
      <TransactionsList
        transactions={filteredTransactions}
        filterOptions={{ categories, parties, types, periods }}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </div>
  );
}
