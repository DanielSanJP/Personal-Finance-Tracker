"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

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
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getCurrentUserTransactions,
  formatCurrency,
  getCurrentMonthName,
} from "@/lib/data";

// Generate dynamic date range description
const getDateRangeDescription = () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const startMonth = sixMonthsAgo.toLocaleDateString("en-US", {
    month: "long",
  });
  const currentMonth = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();

  return `${startMonth} - ${currentMonth} ${year}`;
};

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: string;
}

interface ChartDataPoint {
  month: string;
  spending: number;
}

// Group expenses by month for the last 6 months
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

  // Get last 7 months dynamically
  const now = new Date();
  const chartData: ChartDataPoint[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    // Calculate total expenses for this month
    const monthlyExpenses = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() === date.getMonth() &&
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

export function SpendingChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const transactions = await getCurrentUserTransactions();

        if (Array.isArray(transactions)) {
          const processedData = processChartData(transactions);
          setChartData(processedData);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Error loading chart data:", err);
        setError("Failed to load chart data");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
  const trendPercentage =
    previousMonth !== 0
      ? Math.abs(
          ((currentMonth - previousMonth) / previousMonth) * 100
        ).toFixed(1)
      : "0";
  const isIncreasing = currentMonth > previousMonth; // Higher spending = increasing

  // Calculate Y-axis domain to ensure visibility
  const allValues = chartData.map((d) => d.spending);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = Math.abs(maxValue - minValue) * 0.1 || 50; // 10% padding or minimum 50
  const yAxisMin = Math.max(0, minValue - padding); // Don't go below 0
  const yAxisMax = maxValue + padding;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Monthly Spending</span>
          <span className="text-xs sm:text-base">
            {formatCurrency(currentMonth)} ({currentMonthName})
          </span>
        </CardTitle>
        <CardDescription>{getDateRangeDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="spending"
              type="natural"
              stroke="var(--color-spending)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isIncreasing ? "Trending up" : "Trending down"} by {trendPercentage}%
          this month{" "}
          <TrendingUp
            className={`h-4 w-4 ${
              isIncreasing ? "text-red-500" : "text-green-500 rotate-180"
            }`}
          />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing monthly spending for the last 7 months
        </div>
      </CardFooter>
    </Card>
  );
}
