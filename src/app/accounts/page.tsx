"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserAccounts } from "@/lib/data";
import { AccountsListSkeleton } from "@/components/loading-states";
import Nav from "@/components/nav";

interface Account {
  id: string;
  userId: string;
  name: string;
  balance: number;
  type: string;
  accountNumber: string;
  isActive: boolean;
}

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userAccounts = await getCurrentUserAccounts();
        setAccounts(userAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddAccount = () => {
    router.push("/accounts/add");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav showDashboardTabs={true} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AccountsListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav showDashboardTabs={true} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
          <Button variant="default" onClick={handleAddAccount}>
            Add Account
          </Button>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No accounts found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first account.
              </p>
              <Button onClick={handleAddAccount}>Add Your First Account</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card
                key={account.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      {account.name}
                    </CardTitle>
                    <Badge className={getAccountTypeColor(account.type)}>
                      {account.type.charAt(0).toUpperCase() +
                        account.type.slice(1)}
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
