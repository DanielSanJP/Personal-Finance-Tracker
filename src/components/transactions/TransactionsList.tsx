"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { exportTransactionsToCSV } from "@/lib/export/csv-export";
import { exportTransactionsToPDF } from "@/lib/export/pdf-export";
import { formatCurrency } from "@/lib/utils";
import { useDeleteTransaction } from "@/hooks/queries/useTransactions";
import type { Transaction } from "@/types";
import { EmptyTransactions } from "@/components/empty-states";
import { TransactionSummary } from "./TransactionSummary";
import { TransactionBulkEditModal } from "./TransactionBulkEditModal";
import { TransactionEditModal } from "./TransactionEditModal";
import { TransactionDetailModal } from "./TransactionDetailModal";

interface TransactionsListProps {
  transactions: Transaction[];
  filterOptions: {
    categories: string[];
    merchants: string[];
    types: string[];
    periods: string[];
  };
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedMerchant: string;
  setSelectedMerchant: (merchant: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

export function TransactionsList({
  transactions,
  filterOptions,
  selectedCategory,
  setSelectedCategory,
  selectedPeriod,
  setSelectedPeriod,
  selectedMerchant,
  setSelectedMerchant,
  selectedType,
  setSelectedType,
}: TransactionsListProps) {
  // Mutations
  const deleteTransactionMutation = useDeleteTransaction();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editTransactionsOpen, setEditTransactionsOpen] = useState(false);
  const [editSingleTransactionOpen, setEditSingleTransactionOpen] =
    useState(false);

  // Use props instead of local state and data fetching
  const filteredTransactions = transactions;
  const { categories, merchants, types, periods } = filterOptions;

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleDeleteTransaction = async (transaction: Transaction) => {
    if (await checkGuestAndWarn()) return;

    try {
      await deleteTransactionMutation.mutateAsync(transaction.id);
      toast.success("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

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

  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper function to truncate long merchant names
  const truncateMerchant = (merchant: string, maxLength: number = 30) => {
    if (merchant.length <= maxLength) return merchant;
    return merchant.substring(0, maxLength) + "...";
  };

  // Export handlers
  const handleCSVExport = () => {
    exportTransactionsToCSV(filteredTransactions);
  };

  const handlePDFExport = () => {
    exportTransactionsToPDF(filteredTransactions);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Transaction History
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Buttons - Always visible */}
          <div className="pb-4 flex flex-wrap gap-4 justify-center border-b">
            <Button asChild>
              <Link href="/transactions/add">Add Transaction</Link>
            </Button>

            <TransactionBulkEditModal
              transactions={filteredTransactions}
              open={editTransactionsOpen}
              onOpenChange={setEditTransactionsOpen}
            />

            <Button variant="outline" onClick={handleCSVExport}>
              Export to CSV
            </Button>

            <Button variant="outline" onClick={handlePDFExport}>
              Export to PDF
            </Button>
          </div>

          {/* Filter Controls - Always visible */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by time period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={selectedMerchant}
                onValueChange={setSelectedMerchant}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by merchant">
                    {selectedMerchant &&
                    selectedMerchant !== "All Merchants" ? (
                      <div
                        className="truncate max-w-[150px]"
                        title={selectedMerchant}
                      >
                        {truncateMerchant(selectedMerchant)}
                      </div>
                    ) : (
                      selectedMerchant || "Filter by merchant"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {merchants.map((merchant) => (
                    <SelectItem key={merchant} value={merchant}>
                      <div className="truncate max-w-[200px]" title={merchant}>
                        {truncateMerchant(merchant)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All Types"
                        ? type
                        : formatTransactionType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters Button - Always visible */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedPeriod("This Month");
                setSelectedMerchant("All Merchants");
                setSelectedType("All Types");
              }}
              className="w-auto"
            >
              Clear All Filters
            </Button>
          </div>

          {/* Transaction List or Empty State */}
          {filteredTransactions.length === 0 ? (
            <EmptyTransactions />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div
                            className="font-semibold text-gray-900 truncate max-w-[200px]"
                            title={transaction.description}
                          >
                            {transaction.description}
                          </div>
                          <div
                            className="text-sm text-gray-500 truncate max-w-[200px]"
                            title={transaction.merchant || undefined}
                          >
                            {transaction.merchant || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="text-sm truncate max-w-[120px]"
                          title={transaction.category || undefined}
                        >
                          {transaction.category || "Other"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(transaction.date)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`font-bold ${getAmountColor(
                            transaction.type
                          )}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTransactionClick(transaction);
                              }}
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(transaction.id);
                              }}
                            >
                              Copy transaction ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (await checkGuestAndWarn()) return;
                                setSelectedTransaction(transaction);
                                setEditSingleTransactionOpen(true);
                              }}
                            >
                              Edit transaction
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleDeleteTransaction(transaction);
                              }}
                              className="text-red-600"
                            >
                              Delete transaction
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Transaction Totals Summary */}
              <TransactionSummary transactions={filteredTransactions} />
            </div>
          )}

          {/* Modals - Always available */}
          <TransactionDetailModal
            transaction={selectedTransaction}
            open={detailModalOpen}
            onOpenChange={setDetailModalOpen}
          />

          <TransactionEditModal
            transaction={selectedTransaction}
            open={editSingleTransactionOpen}
            onOpenChange={setEditSingleTransactionOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
}
