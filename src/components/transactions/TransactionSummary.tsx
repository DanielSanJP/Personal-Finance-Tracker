import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

interface TransactionSummaryProps {
  transactions: Transaction[];
}

export function TransactionSummary({ transactions }: TransactionSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netTotal = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mt-6 border-t pt-6 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="text-sm text-gray-600 font-medium">Total Income</div>
          <Badge
            variant="default"
            className="text-base sm:text-lg font-bold px-3 py-1 bg-green-600 hover:bg-green-700"
          >
            +{formatCurrency(totalIncome)}
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
            {formatCurrency(totalExpenses)}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-600 font-medium">Net Total</div>
          <Badge
            variant={netTotal >= 0 ? "default" : "destructive"}
            className={`text-base sm:text-lg font-bold px-3 py-1 ${
              netTotal >= 0 ? "bg-green-600 hover:bg-green-700" : ""
            }`}
          >
            {formatCurrency(netTotal)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
