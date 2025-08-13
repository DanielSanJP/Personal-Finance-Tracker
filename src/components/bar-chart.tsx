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
      <CardFooter className="flex-col items-start gap-2 text-sm">
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
        <div className="text-muted-foreground leading-none">
          {monthsUnderBudget} months under budget, {monthsOverBudget} months
          over budget
        </div>
      </CardFooter>
    </Card>
  );
}
