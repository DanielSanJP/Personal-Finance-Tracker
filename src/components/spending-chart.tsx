"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { getCurrentUserTransactions } from "@/lib/data";

export const description = "A spending line chart";

// Group expenses by month for the last 6 months
const processChartData = () => {
  const transactions = getCurrentUserTransactions();
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

  // Get last 6 months
  const now = new Date();
  const chartData = [];

  for (let i = 5; i >= 0; i--) {
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
      spending: Math.round(monthlyExpenses),
    });
  }

  return chartData;
};

const chartData = processChartData();

const chartConfig = {
  spending: {
    label: "Monthly Spending",
    color: "hsl(220, 98%, 61%)", // Blue color
  },
} satisfies ChartConfig;

export function SpendingChart() {
  // Calculate trend
  const currentMonth = chartData[chartData.length - 1]?.spending || 0;
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
  const yAxisMin = minValue - padding;
  const yAxisMax = maxValue + padding;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>February - July 2025</CardDescription>
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
              tickFormatter={(value) => `$${Math.round(value)}`}
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
          Showing monthly spending for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
