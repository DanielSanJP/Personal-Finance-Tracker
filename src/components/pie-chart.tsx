"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart as RechartsPieChart } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  getCurrentMonthSpendingByCategory,
  getSpendingByCategoryForMonth,
  formatCurrency,
} from "@/lib/data";
import { EmptyState } from "@/components/empty-states";

export const description = "A pie chart showing actual spending by category";

interface PieChartProps {
  spendingData?: Array<{ category: string; spentAmount: number }>;
}

// Chart configuration with blue Tailwind colors
const chartConfig = {
  spentAmount: {
    label: "Spent Amount",
  },
  "Food & Dining": {
    label: "Food & Dining",
    color: "#3b82f6", // blue-500
  },
  Transportation: {
    label: "Transportation",
    color: "#60a5fa", // blue-400
  },
  Shopping: {
    label: "Shopping",
    color: "#1d4ed8", // blue-700
  },
  Entertainment: {
    label: "Entertainment",
    color: "#93c5fd", // blue-300
  },
  "Bills & Utilities": {
    label: "Bills & Utilities",
    color: "#1e40af", // blue-800
  },
  "Health & Fitness": {
    label: "Health & Fitness",
    color: "#dbeafe", // blue-100
  },
  Travel: {
    label: "Travel",
    color: "#2563eb", // blue-600
  },
  Education: {
    label: "Education",
    color: "#bfdbfe", // blue-200
  },
  "Personal Care": {
    label: "Personal Care",
    color: "#1e3a8a", // blue-900
  },
  Housing: {
    label: "Housing",
    color: "#6366f1", // indigo-500
  },
  Other: {
    label: "Other",
    color: "#6b7280", // gray-500
  },
} satisfies ChartConfig;

export function PieChart({ spendingData: propSpendingData }: PieChartProps) {
  const [spendingData, setSpendingData] = useState<
    Array<{ category: string; spentAmount: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
  }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);

  // Helper function to get current month/year display text
  const getCurrentMonthDisplay = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Generate months for selection (last 12 months)
  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      options.push({
        value: `${date.getFullYear()}-${date.getMonth() + 1}`,
        label: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
      });
    }
    return options;
  };

  const monthOptions = generateMonthOptions();

  const handleMonthChange = (value: string) => {
    if (value === "current") {
      const now = new Date();
      setSelectedDate({ year: now.getFullYear(), month: now.getMonth() + 1 });
      setIsCurrentMonth(true);
    } else {
      const [year, month] = value.split("-").map(Number);
      setSelectedDate({ year, month });
      setIsCurrentMonth(false);
    }
  };

  const getCurrentValue = () => {
    if (isCurrentMonth) return "current";
    return `${selectedDate.year}-${selectedDate.month}`;
  };

  useEffect(() => {
    const loadSpendingData = async () => {
      if (propSpendingData) {
        setSpendingData(propSpendingData);
        setLoading(false);
        return;
      }

      try {
        let data: Array<{ category: string; spentAmount: number }>;

        if (isCurrentMonth) {
          data = await getCurrentMonthSpendingByCategory();
        } else {
          data = await getSpendingByCategoryForMonth(
            selectedDate.year,
            selectedDate.month
          );
        }

        setSpendingData(data || []);
      } catch (error) {
        console.error("Error loading spending data:", error);
        setSpendingData([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpendingData();
  }, [propSpendingData, selectedDate, isCurrentMonth]);

  if (loading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px] rounded-full bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Process spending data for pie chart
  const chartData = spendingData
    .filter((item) => item.spentAmount > 0) // Only show categories with spending
    .map((item) => {
      const configItem = chartConfig[item.category as keyof typeof chartConfig];
      const color =
        configItem && "color" in configItem
          ? configItem.color
          : chartConfig.Other.color;
      return {
        category: item.category,
        spentAmount: item.spentAmount,
        fill: color,
      };
    });

  // Calculate insights
  const totalSpent = spendingData.reduce(
    (sum, item) => sum + item.spentAmount,
    0
  );

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Category Spending Breakdown</CardTitle>

          {/* Month Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Viewing:</span>
              <Select
                value={getCurrentValue()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">
                    <div className="flex items-center gap-2">
                      <span>{getCurrentMonthDisplay()}</span>
                      <Badge variant="default" className="text-xs">
                        Current
                      </Badge>
                    </div>
                  </SelectItem>
                  {monthOptions.slice(1).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!isCurrentMonth && (
              <Badge variant="secondary" className="text-xs">
                Historical Analysis
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[500px] flex items-center justify-center">
            <EmptyState
              title="No spending data available"
              description={
                isCurrentMonth
                  ? "Start tracking your expenses to see spending analysis and category breakdown"
                  : `No spending data found for ${new Date(
                      selectedDate.year,
                      selectedDate.month - 1
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}`
              }
              actionText={isCurrentMonth ? "Add Transaction" : undefined}
              actionHref={isCurrentMonth ? "/transactions/add" : undefined}
              icon={
                <svg
                  className="w-full h-full"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Total spending: {formatCurrency(0)}
          </div>
          <div className="text-muted-foreground leading-none">
            No spending data available for the selected period
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Category Spending Breakdown</CardTitle>

        {/* Month Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Viewing:</span>
            <Select value={getCurrentValue()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  <div className="flex items-center gap-2">
                    <span>{getCurrentMonthDisplay()}</span>
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  </div>
                </SelectItem>
                {monthOptions.slice(1).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isCurrentMonth && (
            <Badge variant="secondary" className="text-xs">
              Historical Analysis
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[500px]"
        >
          <RechartsPieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="spentAmount" nameKey="category" />
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total spending: {formatCurrency(totalSpent)}
          {totalSpent > 0 && <TrendingUp className="h-4 w-4" />}
        </div>
        <div className="text-muted-foreground leading-none">
          {isCurrentMonth
            ? "Current month spending by category"
            : `Spending for ${new Date(
                selectedDate.year,
                selectedDate.month - 1
              ).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}`}
        </div>
      </CardFooter>
    </Card>
  );
}
