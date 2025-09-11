import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/types";

interface AccountCardProps {
  account: Account;
  onEdit: (account: Account) => void;
}

export function AccountCard({ account, onEdit }: AccountCardProps) {
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-800";
      case "savings":
        return "bg-green-100 text-green-800";
      case "credit":
        return "bg-red-100 text-red-800";
      case "investment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(account.balance)}
          </div>
          {account.accountNumber && (
            <div className="text-sm text-gray-500">
              Account: {account.accountNumber}
            </div>
          )}
          <div className="flex justify-between items-center pt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                account.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {account.isActive ? "Active" : "Inactive"}
            </span>
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
      </CardContent>
    </Card>
  );
}
