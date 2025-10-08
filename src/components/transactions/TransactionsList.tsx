"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGoals } from "@/hooks/queries/useGoals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    parties: string[]; // Changed from merchants to parties
    types: string[];
    periods: string[];
  };
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedParty: string; // Changed from selectedMerchant
  setSelectedParty: (party: string) => void; // Changed from setSelectedMerchant
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
  selectedParty,
  setSelectedParty,
  selectedType,
  setSelectedType,
}: TransactionsListProps) {
  // Mutations
  const deleteTransactionMutation = useDeleteTransaction();

  // Fetch goals for displaying goal names in transfers
  const { data: goals = [] } = useGoals();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [partyDialogOpen, setPartyDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"amount" | "name" | "date" | "none">(
    "none"
  );
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editTransactionsOpen, setEditTransactionsOpen] = useState(false);
  const [editSingleTransactionOpen, setEditSingleTransactionOpen] =
    useState(false);

  const { categories, parties, types, periods } = filterOptions;

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

  // Helper function to get goal name from destination_account_id
  const getGoalName = (goalId: string | null | undefined): string | null => {
    if (!goalId) return null;
    const goal = goals.find((g) => g.id === goalId);
    return goal?.name || null;
  };

  // Helper function to get the relevant party to display
  const getDisplayParty = (transaction: Transaction): string => {
    if (transaction.type === "expense") {
      return transaction.to_party || "N/A"; // Show merchant
    } else if (transaction.type === "income") {
      return transaction.from_party || "N/A"; // Show income source
    } else if (transaction.type === "transfer") {
      // Check if it's a goal contribution (has destination_account_id)
      const goalName = getGoalName(transaction.destination_account_id);
      if (goalName) {
        return `To Goal: ${goalName}`;
      }
      return `To: ${transaction.to_party || "N/A"}`; // Show destination
    }
    return "N/A";
  };

  // Apply sorting to transactions
  const filteredTransactions =
    sortBy === "none"
      ? transactions
      : [...transactions].sort((a, b) => {
          if (sortBy === "date") {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            const comparison = dateB - dateA; // Default newest first
            return sortDirection === "desc" ? comparison : -comparison;
          } else if (sortBy === "amount") {
            const comparison = Math.abs(b.amount) - Math.abs(a.amount);
            return sortDirection === "desc" ? comparison : -comparison;
          } else if (sortBy === "name") {
            // Sort by party name
            const partyA = getDisplayParty(a).trim().toLowerCase();
            const partyB = getDisplayParty(b).trim().toLowerCase();
            const comparison = partyA.localeCompare(partyB);
            return sortDirection === "desc" ? comparison : -comparison;
          }
          // Fallback
          return 0;
        });

  // Export handlers
  const handleCSVExport = () => {
    exportTransactionsToCSV(filteredTransactions);
  };

  const handlePDFExport = () => {
    exportTransactionsToPDF(filteredTransactions);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 pb-4 justify-center [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:justify-self-center">
            <Button asChild className="min-w-[140px]">
              <Link href="/transactions/add">Add Expense</Link>
            </Button>

            <TransactionBulkEditModal
              transactions={filteredTransactions}
              open={editTransactionsOpen}
              onOpenChange={setEditTransactionsOpen}
            />

            <Button
              variant="outline"
              onClick={handleCSVExport}
              className="min-w-[140px]"
            >
              Export to CSV
            </Button>

            <Button
              variant="outline"
              onClick={handlePDFExport}
              className="min-w-[140px]"
            >
              Export to PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Transaction History
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Filter Controls - Always visible */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
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
              <Dialog open={partyDialogOpen} onOpenChange={setPartyDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    <span className="truncate">
                      {selectedParty || "Filter by party"}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Select Party</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto max-h-[60vh] pr-4">
                    <div className="space-y-2">
                      {(() => {
                        // Sort parties based on selection (only for amount/name, date doesn't apply to parties)
                        const sortedParties = [...parties];
                        if (sortBy === "name") {
                          sortedParties.sort((a, b) => {
                            // Keep "All Parties" at the top
                            if (a === "All Parties") return -1;
                            if (b === "All Parties") return 1;
                            // Extract party name before the amount in parentheses and trim whitespace
                            const nameA = a.includes(" (")
                              ? a
                                  .substring(0, a.indexOf(" ("))
                                  .trim()
                                  .toLowerCase()
                              : a.trim().toLowerCase();
                            const nameB = b.includes(" (")
                              ? b
                                  .substring(0, b.indexOf(" ("))
                                  .trim()
                                  .toLowerCase()
                              : b.trim().toLowerCase();
                            const comparison = nameA.localeCompare(nameB);
                            return sortDirection === "desc"
                              ? comparison
                              : -comparison;
                          });
                        } else if (sortBy === "amount") {
                          // For amount sort, reverse if ascending but keep "All Parties" at top
                          if (sortDirection === "asc") {
                            // Remove "All Parties" temporarily
                            const allPartiesIndex =
                              sortedParties.indexOf("All Parties");
                            let allPartiesItem = null;
                            if (allPartiesIndex !== -1) {
                              allPartiesItem = sortedParties.splice(
                                allPartiesIndex,
                                1
                              )[0];
                            }
                            // Reverse the rest
                            sortedParties.reverse();
                            // Put "All Parties" back at the top
                            if (allPartiesItem) {
                              sortedParties.unshift(allPartiesItem);
                            }
                          }
                        }
                        // Note: date sort doesn't affect party list
                        return sortedParties.map((party) => {
                          const isSelected = selectedParty === party;
                          return (
                            <button
                              key={party}
                              onClick={() => {
                                setSelectedParty(party);
                                setPartyDialogOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                                isSelected
                                  ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
                                  : "bg-white border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{party}</span>
                                {isSelected && (
                                  <span className="text-blue-600 font-bold">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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

          {/* Sort Control */}
          <div className="flex justify-center">
            <Select
              value={`${sortBy}-${sortDirection}`}
              onValueChange={(value) => {
                const [newSortBy, newSortDirection] = value.split("-") as [
                  "amount" | "name" | "date" | "none",
                  "desc" | "asc"
                ];
                setSortBy(newSortBy);
                setSortDirection(newSortDirection);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-desc">Sort By</SelectItem>
                <SelectItem value="date-desc">Newest-Oldest</SelectItem>
                <SelectItem value="date-asc">Oldest-Newest</SelectItem>
                <SelectItem value="name-desc">A-Z</SelectItem>
                <SelectItem value="name-asc">Z-A</SelectItem>
                <SelectItem value="amount-desc">High-Low</SelectItem>
                <SelectItem value="amount-asc">Low-High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button - Always visible */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedPeriod("This Month");
                setSelectedParty("All Parties");
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
                            title={getDisplayParty(transaction)}
                          >
                            {getDisplayParty(transaction)}
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

      {/* Transaction Summary */}
      {filteredTransactions.length > 0 && (
        <TransactionSummary transactions={filteredTransactions} />
      )}
    </div>
  );
}
