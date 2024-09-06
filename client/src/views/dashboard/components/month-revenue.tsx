"use client";

import * as React from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSWR from "swr";
import { reportRequest } from "@/api-requests/report.request";
import { Report } from "@/schemas/report.schema";
import dayjs from "dayjs";
import { fixed, formatDate, formatPrice } from "@/lib/utils";
import MonthSelect, { DateRange } from "@@/month-select";

export const description = "An interactive line chart";

const chartConfig = {
  amount: { label: "Doanh thu", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const MonthRevenue = () => {
  const [avg, setAvg] = React.useState<number>(0);
  const [range, setRange] = React.useState<DateRange>({
    from: formatDate(dayjs().utc(true).startOf("month")),
    to: formatDate(dayjs().utc(true).endOf("month")),
  });
  const { data } = useSWR(
    range ? `period-revenue?from=${range.from}&to=${range.to}` : undefined,
    reportRequest.get<Report.Income[]>,
    {
      onSuccess: (data) => {
        if (data) {
          const sum = data.reduce((prev, curr) => prev + curr.amount, 0);
          setAvg(fixed(sum / dayjs().utc(true).get("date") || 0, 0));
        }
      },
    },
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>
            Thể hiện doanh thu từng ngày và bình quân của tháng
          </CardDescription>
        </div>
        <div className="flex">
          <MonthSelect preventFuture onChange={setRange} />
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("vi-vn", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="amount"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("vi-vn", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={"amount"}
              type="monotone"
              stroke={"var(--color-amount)"}
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              y={avg}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value={formatPrice(avg)}
                className="text-lg"
                fill="hsl(var(--foreground))"
                offset={10}
                startOffset={100}
              />
            </ReferenceLine>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthRevenue;
