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
import { toast } from "sonner";
import { checkGuestAndWarn } from "@/lib/guest-protection";
import type { Transaction } from "@/types";

interface TransactionBulkEditModalProps {
  transactions: Transaction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionBulkEditModal({
  transactions,
  open,
  onOpenChange,
}: TransactionBulkEditModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await checkGuestAndWarn()) return;
    // Save bulk transactions functionality will go here
    toast.info("Bulk save functionality not implemented yet");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
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
            Modify your existing transactions and their details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
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
                  <Label htmlFor={`desc-${transaction.id}`}>Description</Label>
                  <Input
                    id={`desc-${transaction.id}`}
                    defaultValue={transaction.description}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`amount-${transaction.id}`}>Amount</Label>
                  <Input
                    id={`amount-${transaction.id}`}
                    type="number"
                    defaultValue={Math.abs(transaction.amount)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor={`category-${transaction.id}`}>Category</Label>
                  <Input
                    id={`category-${transaction.id}`}
                    defaultValue={transaction.category || ""}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`type-${transaction.id}`}>Type</Label>
                  <Input
                    id={`type-${transaction.id}`}
                    defaultValue={transaction.type}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
