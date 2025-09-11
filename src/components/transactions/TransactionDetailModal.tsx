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
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Complete information about this transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-600">
              Description
            </Label>
            <p className="text-base font-semibold">{transaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-600">
                Amount
              </Label>
              <p
                className={`text-lg font-bold ${getAmountColor(
                  transaction.type
                )}`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(Math.abs(transaction.amount))}
              </p>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-600">Type</Label>
              <p className="text-base">
                {formatTransactionType(transaction.type)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-600">
                Category
              </Label>
              <p className="text-base">{transaction.category}</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-600">
                Status
              </Label>
              <p className="text-base capitalize">{transaction.status}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-600">
              Merchant
            </Label>
            <p className="text-base">{transaction.merchant}</p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-600">Date</Label>
            <p className="text-base">{formatFullDate(transaction.date)}</p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium text-gray-600">
              Transaction ID
            </Label>
            <p className="text-sm text-gray-500 font-mono">{transaction.id}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
