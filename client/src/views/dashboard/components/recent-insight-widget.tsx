"use client";
import React from "react";
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@@/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/ui/card";

import useSWR from "swr";
import { reportRequest } from "@/api-requests/report.request";
import { fixed, formatPrice } from "@/lib/utils";
import { Report } from "@/schemas/report.schema";

const RecentInsightWidget = () => {
  const [avg, setAvg] = React.useState<number>(0);
  const { data } = useSWR("recent-income", reportRequest.get<Report.Income[]>, {
    onSuccess: (data) => {
      if (data) {
        const sum = data.reduce((prev, curr) => prev + curr.amount, 0);
        setAvg(fixed(sum / 7 || 0, 0));
      }
    },
  });

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>7 ngày gần đây</CardTitle>
        <CardDescription>
          Biểu đồ doanh thu trong 7 ngày gần đây, bình quân mỗi ngày đạt
          <span className="text-2xl font-bold ml-1">{formatPrice(avg)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 pb-0 pt-4">
        <ChartContainer
          config={{
            amount: { label: "Doanh thu", color: "hsl(var(--chart-1))" },
          }}
          className="mx-auto w-full"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={data}
          >
            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.85} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("vi-vn", {
                  weekday: "short",
                });
              }}
            />
            <ChartTooltip
              defaultIndex={2}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("vi-vn", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
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
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RecentInsightWidget;
