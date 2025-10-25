import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowRightLeft } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import type { Account } from "@/types";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
  onTransfer?: (account: Account) => void;
}

export function AccountCard({ account, onEdit, onTransfer }: AccountCardProps) {
  const { formatCurrency } = useCurrency();
  const { preferences } = useUserPreferences();

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-primary/10 text-primary";
      case "savings":
        return "bg-green-100 text-green-800";
      case "credit":
        return "bg-red-100 text-red-800";
      case "investment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-muted/50 text-muted-foreground";
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-shadow ${
        !account.isActive ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {account.name}
          </CardTitle>
          <Badge className={getAccountTypeColor(account.type)}>
            {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(account.balance)}
          </div>
          {preferences.show_account_numbers && account.accountNumber && (
            <div className="text-sm text-muted-foreground">
              Account: {account.accountNumber}
            </div>
          )}
          <div className="flex justify-between items-center pt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                account.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {account.isActive ? "Active" : "Inactive"}
            </span>
            <div className="flex gap-2">
              {onTransfer && account.isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTransfer(account)}
                  className="h-8 w-8 p-0"
                  title="Transfer funds"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only">Transfer funds</span>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(account)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit account</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
