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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Monthly Budget Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {budgets.length === 0 ? (
            <EmptyBudgets onRefresh={onRefresh} />
          ) : (
            <>
              {/* Action Buttons - Show at top when there are budgets */}
              <BudgetActions budgets={budgets} />

              {/* Budget List */}
              <BudgetList budgets={budgets} />

              {/* Budget Summary */}
              <BudgetSummary budgets={budgets} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
