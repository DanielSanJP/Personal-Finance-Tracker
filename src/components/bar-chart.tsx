"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { getYearlyBudgetAnalysis } from "@/lib/data";
import { EmptyState } from "@/components/empty-states";

interface MonthlyBudgetData {
  month: string;
  spending: number;
  budgetLimit: number;
  status: "under" | "over" | "close";
}

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
  budgetLimit: {
    label: "Budget Limit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarChart() {
  const [data, setData] = useState<MonthlyBudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    return new Date().getFullYear();
  });

  // Generate year options (current year and previous 4 years)
  const generateYearOptions = () => {
    const options = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      const year = currentYear - i;
      options.push({
        value: year.toString(),
        label: year.toString(),
        year: year,
        isCurrent: i === 0,
      });
    }
    return options;
  };

  const yearOptions = generateYearOptions();

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  useEffect(() => {
    const loadYearlyData = async () => {
      try {
        setLoading(true);
        const yearlyAnalysis = await getYearlyBudgetAnalysis(selectedYear);
        setData(yearlyAnalysis || []);
      } catch (error) {
        console.error("Error loading yearly data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadYearlyData();
  }, [selectedYear]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-6 w-48 bg-muted rounded animate-pulse mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data state - check if data exists and has meaningful spending values
  if (data.length === 0 || data.every((item) => item.spending === 0)) {
    const now = new Date();
    const isCurrentYear = selectedYear === now.getFullYear();

    const emptyStateConfig = isCurrentYear
      ? {
          title: "No spending data available",
          description:
            "Start tracking your expenses to see yearly spending analysis and trends",
          showAction: true,
          actionText: "Add Transaction",
          actionHref: "/transactions/add",
        }
      : {
          title: "No spending data available",
          description: `No budget data found for ${selectedYear}. This year has no recorded transactions.`,
          showAction: false,
        };

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Yearly Spending Chart</CardTitle>
              <CardDescription>
                Monthly spending analysis - {selectedYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {/* Year Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Year:</span>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-38">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.label}</span>
                          {option.isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <EmptyState
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
            actionText={
              emptyStateConfig.showAction
                ? emptyStateConfig.actionText
                : undefined
            }
            actionHref={
              emptyStateConfig.showAction
                ? emptyStateConfig.actionHref
                : undefined
            }
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
        </CardContent>
      </Card>
    );
  }

  // Calculate total spending and budget for the period
  const totalSpending = data.reduce((sum, item) => sum + item.spending, 0);
  const totalBudget = data.reduce((sum, item) => sum + item.budgetLimit, 0);
  const maxBudget =
    data.length > 0 ? Math.max(...data.map((item) => item.budgetLimit)) : 0;

  // Calculate trend
  const isOverBudget = totalSpending > totalBudget;
  const percentageDiff =
    totalBudget > 0 ? ((totalSpending - totalBudget) / totalBudget) * 100 : 0;

  // Count months over/under budget
  const monthsOverBudget = data.filter((item) => item.status === "over").length;
  const monthsUnderBudget = data.filter(
    (item) => item.status === "under"
  ).length;

  // Function to get bar color based on status
  const getBarColor = (status: string) => {
    switch (status) {
      case "over":
        return "#ef4444"; // red-500 - same as budget page
      case "close":
        return "#f97316"; // orange-500 - same as budget page
      case "under":
        return "#10b981"; // emerald-500 - green for good performance
      default:
        return "#374151"; // gray-700 - similar to gray-900 from budget page
    }
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Yearly Spending Chart</CardTitle>
            <CardDescription>
              Monthly spending analysis - {selectedYear}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            {/* Year Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Year:</span>
              <Select
                value={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-38">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.label}</span>
                        {option.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Budget Display */}
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Max Budget</div>
              <div className="text-lg font-semibold">
                $
                {Math.max(
                  ...data.map((item) => item.budgetLimit)
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsBarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            {/* Budget line */}
            <ReferenceLine
              y={maxBudget}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: "Max Budget", position: "insideTopRight" }}
            />
            <Bar dataKey="spending" fill="hsl(var(--chart-1))" radius={8}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start text-sm">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-2 leading-none font-medium">
            {isOverBudget ? (
              <>
                Over budget by {Math.abs(percentageDiff).toFixed(1)}%{" "}
                <TrendingUp className="h-4 w-4 text-destructive" />
              </>
            ) : (
              <>
                Under budget by {Math.abs(percentageDiff).toFixed(1)}%{" "}
                <TrendingDown className="h-4 w-4 text-green-600" />
              </>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Spending</div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="text-muted-foreground leading-none">
            {monthsUnderBudget} months under budget, {monthsOverBudget} months
            over budget
          </div>
          <div className="text-lg font-semibold">
            ${totalSpending.toLocaleString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
