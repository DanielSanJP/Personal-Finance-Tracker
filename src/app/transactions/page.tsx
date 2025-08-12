"use client";

import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { getCurrentUserTransactions, formatCurrency } from "@/lib/data";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import { EmptyTransactions } from "@/components/empty-states";
import { TransactionsListSkeleton } from "@/components/loading-states";
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedMerchant, setSelectedMerchant] = useState("All Merchants");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editTransactionsOpen, setEditTransactionsOpen] = useState(false);
  const [editSingleTransactionOpen, setEditSingleTransactionOpen] =
    useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUserTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Get unique categories for filter
  const categories = [
    "All Categories",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];
  const periods = [
    "This Month",
    "Last Month",
    "Last 3 Months",
    "This Year",
    "All Time",
  ];

  // Get unique merchants for filter
  const merchants = [
    "All Merchants",
    ...Array.from(new Set(transactions.map((t) => t.merchant).filter(Boolean))),
  ];

  // Get unique transaction types for filter
  const types = [
    "All Types",
    ...Array.from(new Set(transactions.map((t) => t.type))),
  ];

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
        // Calculate 3 months ago from the first day of the current month
        const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const threeMonthsAgo = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 3,
          1
        );
        const transactionDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );
        return transactionDate >= threeMonthsAgo;
      case "This Year":
        return date.getFullYear() === currentYear;
      case "All Time":
        return true;
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

    // Merchant filter
    if (
      selectedMerchant !== "All Merchants" &&
      transaction.merchant !== selectedMerchant
    ) {
      return false;
    }

    // Type filter
    if (selectedType !== "All Types" && transaction.type !== selectedType) {
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

  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <TransactionsListSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Transaction History
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {transactions.length === 0 ? (
                <EmptyTransactions />
              ) : (
                <>
                  {/* Filter Controls */}
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
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                      >
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
                          <SelectValue placeholder="Filter by merchant" />
                        </SelectTrigger>
                        <SelectContent>
                          {merchants.map((merchant) => (
                            <SelectItem key={merchant} value={merchant}>
                              {merchant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
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

                  {/* Clear Filters Button */}
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

                  {/* Transaction List */}
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
                        {filteredTransactions.length ? (
                          filteredTransactions.map((transaction) => (
                            <TableRow
                              key={transaction.id}
                              className="cursor-pointer hover:bg-gray-50"
                              onClick={() =>
                                handleTransactionClick(transaction)
                              }
                            >
                              <TableCell className="font-medium">
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {transaction.description}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {transaction.merchant}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {transaction.category}
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
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
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
                                        navigator.clipboard.writeText(
                                          transaction.id
                                        );
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
                                        if (await checkGuestAndWarn()) return;
                                        // Delete transaction functionality will go here
                                        toast.info(
                                          "Delete functionality not implemented yet"
                                        );
                                      }}
                                      className="text-red-600"
                                    >
                                      Delete transaction
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No transactions found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {/* Transaction Totals Summary */}
                    <div className="mt-6 border-t pt-6 pb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600 font-medium">
                            Total Income
                          </div>
                          <Badge
                            variant="default"
                            className="text-base sm:text-lg font-bold px-3 py-1 bg-green-600 hover:bg-green-700"
                          >
                            +
                            {formatCurrency(
                              filteredTransactions
                                .filter((t) => t.type === "income")
                                .reduce((sum, t) => sum + t.amount, 0)
                            )}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600 font-medium">
                            Total Expenses
                          </div>
                          <Badge
                            variant="destructive"
                            className="text-base sm:text-lg font-bold px-3 py-1"
                          >
                            {formatCurrency(
                              filteredTransactions
                                .filter((t) => t.type === "expense")
                                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                            )}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600 font-medium">
                            Net Total
                          </div>
                          <Badge
                            variant={
                              filteredTransactions.reduce(
                                (sum, t) => sum + t.amount,
                                0
                              ) >= 0
                                ? "default"
                                : "destructive"
                            }
                            className={`text-base sm:text-lg font-bold px-3 py-1 ${
                              filteredTransactions.reduce(
                                (sum, t) => sum + t.amount,
                                0
                              ) >= 0
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                            }`}
                          >
                            {formatCurrency(
                              filteredTransactions.reduce(
                                (sum, t) => sum + t.amount,
                                0
                              )
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Detail Modal */}
                  <Dialog
                    open={detailModalOpen}
                    onOpenChange={setDetailModalOpen}
                  >
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
                                {selectedTransaction.type === "income"
                                  ? "+"
                                  : "-"}
                                {formatCurrency(
                                  Math.abs(selectedTransaction.amount)
                                )}
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-sm font-medium text-gray-600">
                                Type
                              </Label>
                              <p className="text-base">
                                {formatTransactionType(
                                  selectedTransaction.type
                                )}
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

                  {/* Edit Single Transaction Modal */}
                  <Dialog
                    open={editSingleTransactionOpen}
                    onOpenChange={setEditSingleTransactionOpen}
                  >
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>
                          Update the details of this transaction.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTransaction && (
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-description">
                              Description
                            </Label>
                            <Input
                              id="edit-description"
                              defaultValue={selectedTransaction.description}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-amount">Amount</Label>
                              <Input
                                id="edit-amount"
                                type="number"
                                defaultValue={Math.abs(
                                  selectedTransaction.amount
                                )}
                                className="w-full"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-type">Type</Label>
                              <Select defaultValue={selectedTransaction.type}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="expense">
                                    Expense
                                  </SelectItem>
                                  <SelectItem value="income">Income</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-category">Category</Label>
                              <Input
                                id="edit-category"
                                defaultValue={selectedTransaction.category}
                                className="w-full"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select defaultValue={selectedTransaction.status}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-merchant">Merchant</Label>
                            <Input
                              id="edit-merchant"
                              defaultValue={selectedTransaction.merchant}
                              className="w-full"
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                              id="edit-date"
                              type="date"
                              defaultValue={selectedTransaction.date}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter className="gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditSingleTransactionOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (await checkGuestAndWarn()) return;
                            // Save single transaction functionality will go here
                            toast.info(
                              "Save functionality not implemented yet"
                            );
                          }}
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Action Buttons */}
                  <div className="pt-6 space-y-4 flex flex-col items-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button asChild className="w-40">
                        <Link href="/transactions/add">Add Transaction</Link>
                      </Button>

                      <Dialog
                        open={editTransactionsOpen}
                        onOpenChange={setEditTransactionsOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-40"
                            onClick={async () => {
                              if (await checkGuestAndWarn()) return;
                            }}
                          >
                            Edit Transactions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit All Transactions</DialogTitle>
                            <DialogDescription>
                              Modify your existing transactions and their
                              details.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                            {filteredTransactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="grid gap-3 p-4 border rounded-lg"
                              >
                                <div className="flex items-center justify-between">
                                  <Label className="text-base font-medium">
                                    {transaction.description}
                                  </Label>
                                  <div className="text-sm text-gray-500">
                                    {formatDate(transaction.date)}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor={`desc-${transaction.id}`}>
                                      Description
                                    </Label>
                                    <Input
                                      id={`desc-${transaction.id}`}
                                      defaultValue={transaction.description}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor={`amount-${transaction.id}`}>
                                      Amount
                                    </Label>
                                    <Input
                                      id={`amount-${transaction.id}`}
                                      type="number"
                                      defaultValue={Math.abs(
                                        transaction.amount
                                      )}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor={`category-${transaction.id}`}
                                    >
                                      Category
                                    </Label>
                                    <Input
                                      id={`category-${transaction.id}`}
                                      defaultValue={transaction.category}
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor={`merchant-${transaction.id}`}
                                    >
                                      Merchant
                                    </Label>
                                    <Input
                                      id={`merchant-${transaction.id}`}
                                      defaultValue={transaction.merchant}
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Type:{" "}
                                  {formatTransactionType(transaction.type)} |
                                  Status:{" "}
                                  {transaction.status.charAt(0).toUpperCase() +
                                    transaction.status.slice(1)}
                                </div>
                              </div>
                            ))}
                          </div>
                          <DialogFooter className="gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditTransactionsOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              onClick={async (e) => {
                                e.preventDefault();
                                if (await checkGuestAndWarn()) return;
                                // Save bulk transactions functionality will go here
                                toast.info(
                                  "Bulk save functionality not implemented yet"
                                );
                              }}
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        variant="outline"
                        className="w-40"
                        onClick={() =>
                          toast(
                            "Export Data functionality not implemented yet",
                            {
                              description:
                                "This feature will be available in a future update.",
                              action: {
                                label: "Dismiss",
                                onClick: () => console.log("Dismissed"),
                              },
                            }
                          )
                        }
                      >
                        Export Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-40"
                        onClick={() =>
                          toast(
                            "Advanced Search functionality not implemented yet",
                            {
                              description:
                                "This feature will be available in a future update.",
                              action: {
                                label: "Dismiss",
                                onClick: () => console.log("Dismissed"),
                              },
                            }
                          )
                        }
                      >
                        Advanced Search
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
