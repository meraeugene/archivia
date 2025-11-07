"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { TrendingUp } from "lucide-react";

export const description = "A multiple bar chart";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  accepted: {
    label: "Accepted",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface ChartBarMultipleProps {
  adviserRequest: Array<{
    month: string;
    pending: number;
    accepted: number;
  }>;
}

export function ChartBarMultiple({ adviserRequest }: ChartBarMultipleProps) {
  const currentYear = new Date().getFullYear();

  // All months in order
  const allMonths = [
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

  const monthMap = Object.fromEntries(
    adviserRequest.map((item) => [item.month.trim(), item])
  );

  const chartData = allMonths.map((month) => ({
    month,
    pending: monthMap[month]?.pending ?? 0,
    accepted: monthMap[month]?.accepted ?? 0,
  }));

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Monthly Adviser Requests </CardTitle>
        <CardDescription>January - December {currentYear}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-72">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
            <Bar dataKey="accepted" fill="var(--color-accepted)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Total requests this month: {chartData[new Date().getMonth()].pending}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing requests from January to December {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
}
