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
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";

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
    year: number;
    month: string;
    pending: number;
    accepted: number;
  }>;
}

export function ChartBarMultiple({ adviserRequest }: ChartBarMultipleProps) {
  const [selectedYear, setSelectedYear] = useState(2025);

  const chartData = adviserRequest.filter((d) => d.year === selectedYear);

  const currentYear = new Date().getFullYear();

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Monthly Adviser Requests</CardTitle>
          <CardDescription>January - December {selectedYear}</CardDescription>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--chart-1)]"></span>
              <span className="text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--chart-3)]"></span>
              <span className="text-muted-foreground">Accepted</span>
            </div>
          </div>

          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[120px]  cursor-pointer">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(adviserRequest.map((d) => d.year))].map((year) => (
                <SelectItem
                  key={year}
                  value={String(year)}
                  className="cursor-pointer"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
