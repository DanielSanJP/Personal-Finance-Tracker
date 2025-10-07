"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyBudgets } from "@/components/empty-states";
import BudgetActions from "./BudgetActions";
import { BudgetList } from "./BudgetList";
import BudgetSummary from "./BudgetSummary";
import { Budget } from "@/types";

interface BudgetContentProps {
  budgets?: Budget[];
  onRefresh?: () => void;
}

export function BudgetContent({ budgets = [], onRefresh }: BudgetContentProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {budgets.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">
              Monthly Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyBudgets onRefresh={onRefresh} />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Quick Actions */}
          <BudgetActions budgets={budgets} />

          {/* Budget List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                Budget Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetList budgets={budgets} />
            </CardContent>
          </Card>

          {/* Budget Summary */}
          <BudgetSummary budgets={budgets} />
        </>
      )}
    </div>
  );
}
