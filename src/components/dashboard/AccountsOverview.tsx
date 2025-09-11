"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyAccounts } from "@/components/empty-states";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/types";

interface AccountsOverviewProps {
  accounts: Account[];
}

export default function AccountsOverview({ accounts }: AccountsOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <EmptyAccounts />
        ) : (
          <div className="space-y-2">
            {accounts.map((account, index) => (
              <div
                key={account.id}
                className={`flex justify-between items-center py-2 ${
                  index < accounts.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="text-muted-foreground">{account.name}</span>
                <span className="font-semibold">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
