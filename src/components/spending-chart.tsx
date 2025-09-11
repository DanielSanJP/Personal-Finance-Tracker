"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useState, useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { formatCurrency, getCurrentMonthName } from "@/lib/utils";
import type { Transaction } from "@/types";

// Generate dynamic date range description
const getDateRangeDescription = () => {
  const now = new Date();
  const currentMonth = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();

  return `January - ${currentMonth} ${year}`;
};

interface ChartDataPoint {
  month: string;
  spending: number;
}

interface SpendingChartProps {
  transactions?: Transaction[];
}

// Group expenses by month from January to current month
const processChartData = (transactions: Transaction[]): ChartDataPoint[] => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get current year and month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based (0 = January, 7 = August)
  const chartData: ChartDataPoint[] = [];

  // Loop from January (0) to current month (inclusive)
  for (let monthIndex = 0; monthIndex <= currentMonth; monthIndex++) {
    const monthName = months[monthIndex];

    // Calculate total expenses for this month
    const monthlyExpenses = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === currentYear &&
          transactionDate.getMonth() === monthIndex &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    chartData.push({
      month: monthName,
      spending: monthlyExpenses,
    });
  }

  return chartData;
};

const chartConfig = {
  spending: {
    label: "Monthly Spending",
    color: "hsl(220, 98%, 61%)", // Blue color
  },
} satisfies ChartConfig;

export function SpendingChart({
  transactions: propTransactions,
}: SpendingChartProps = {}) {
  const [error, setError] = useState<string | null>(null);

  // Use React Query hook to get transactions if not provided via props
  const { data: fetchedTransactions = [], isLoading } = useTransactions();

  // Memoize the transactions to use to prevent unnecessary re-renders
  const transactions = useMemo(() => {
    return propTransactions || fetchedTransactions;
  }, [propTransactions, fetchedTransactions]);

  // Memoize the chart data processing
  const chartData = useMemo(() => {
    try {
      setError(null);
      if (Array.isArray(transactions) && transactions.length > 0) {
        return processChartData(transactions);
      }
      return [];
    } catch (err) {
      console.error("Error processing chart data:", err);
      setError("Failed to process chart data");
      return [];
    }
  }, [transactions]);

  // Loading state should come from React Query when no prop transactions are provided
  const loading = propTransactions ? false : isLoading;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const currentMonth = chartData[chartData.length - 1]?.spending || 0;
  const currentMonthName = getCurrentMonthName();
  const previousMonth = chartData[chartData.length - 2]?.spending || 0;

  let trendPercentage = "0";
  let isIncreasing = false;

  if (previousMonth === 0 && currentMonth > 0) {
    // If previous month was $0 and current month has spending, it's a 100% increase
    trendPercentage = "100";
    isIncreasing = true;
  } else if (currentMonth === 0 && previousMonth > 0) {
    // If current month is $0 and previous month had spending, it's a 100% decrease
    trendPercentage = "100";
    isIncreasing = false;
  } else if (previousMonth > 0) {
    // Normal calculation when previous month has value
    const percentageChange =
      ((currentMonth - previousMonth) / previousMonth) * 100;
    trendPercentage = Math.abs(percentageChange).toFixed(1);
    isIncreasing = percentageChange > 0;
  } else if (currentMonth === 0 && previousMonth === 0) {
    // Both months are $0, no change
    trendPercentage = "0";
    isIncreasing = false;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Monthly Spending</span>
          <span className="text-xs">
            {formatCurrency(currentMonth)} ({currentMonthName})
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          {getDateRangeDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            height={200}
            margin={{
              left: 12,
              right: 12,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-foreground text-sm">
                          {label}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: payload[0].color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            Monthly Spending:
                          </span>
                          <span className="font-semibold text-foreground text-sm">
                            {formatCurrency(payload[0].value as number)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-2">
        <div className="flex gap-2 leading-none font-medium">
          {isIncreasing ? "Trending up" : "Trending down"} by {trendPercentage}%
          this month{" "}
          <TrendingUp
            className={`h-3 w-3 ${
              isIncreasing ? "text-red-500" : "text-green-500 rotate-180"
            }`}
          />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing monthly spending from January to current month
        </div>
      </CardFooter>
    </Card>
  );
}
