"use client";
import React from "react";
import { Bar, BarChart, Rectangle, XAxis } from "recharts";
import { ChartContainer } from "@@/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import useSWR from "swr";
import { reportRequest } from "@/api-requests/report.request";
import dayjs from "dayjs";
import { formatPrice } from "@/lib/utils";

const TodayInsightWidget = () => {
  const [today, setToday] = React.useState<number>(0);
  const { data } = useSWR(
    "today-and-recent-income",
    reportRequest.getTodayIncomeAndRecent,
    {
      onSuccess: (data) => {
        if (data) {
          const todayObj = data.find(
            (item) => item.date == dayjs().format("YYYY-MM-DD"),
          );
          if (todayObj) {
            setToday(todayObj.amount);
          }
        }
      },
    },
  );
  return (
    <Card className="max-w-xs" x-chunk="charts-01-chunk-3">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Doanh thu hôm nay</CardTitle>
        <CardDescription>
          Tình hình doanh thu trong 7 ngày gần đây, và hôm nay đạt
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
          {formatPrice(today)}
          <span className="text-sm font-normal text-muted-foreground">đ</span>
        </div>
        <ChartContainer
          config={{
            amounts: { label: "Doanh thu", color: "hsl(var(--chart-1))" },
          }}
          className="ml-auto w-[72px]"
        >
          <BarChart
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            data={data}
          >
            <Bar
              dataKey="amount"
              fill="var(--color-amounts)"
              radius={2}
              fillOpacity={0.2}
              activeIndex={6}
              activeBar={<Rectangle fillOpacity={0.85} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              hide
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TodayInsightWidget;
