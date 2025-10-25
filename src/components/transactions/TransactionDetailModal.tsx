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
import { useGoals } from "@/hooks/queries/useGoals";

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
  // Fetch goals for displaying goal names in transfers
  const { data: goals = [] } = useGoals();

  if (!transaction) return null;

  // Helper function to get goal name from destination_account_id
  const getGoalName = (goalId: string | null | undefined): string | null => {
    if (!goalId) return null;
    const goal = goals.find((g) => g.id === goalId);
    return goal?.name || null;
  };

  const formatFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
            <Label className="text-sm font-medium text-muted-foreground">
              Description
            </Label>
            <p className="text-base font-semibold">{transaction.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-muted-foreground">
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
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <p className="text-base">
                {formatTransactionType(transaction.type)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Category
              </Label>
              <p className="text-base">{transaction.category}</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <p className="text-base capitalize">{transaction.status}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-muted-foreground">From</Label>
              <p className="text-base">{transaction.from_party}</p>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-muted-foreground">To</Label>
              <p className="text-base">
                {transaction.type === "transfer" &&
                getGoalName(transaction.destination_account_id)
                  ? `${getGoalName(transaction.destination_account_id)} (Goal)`
                  : transaction.to_party}
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Date & Time
            </Label>
            <p className="text-base font-medium">
              {formatFullDateTime(transaction.date)}
            </p>
          </div>

          <div className="grid gap-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Transaction ID
            </Label>
            <p className="text-sm text-muted-foreground font-mono">{transaction.id}</p>
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
