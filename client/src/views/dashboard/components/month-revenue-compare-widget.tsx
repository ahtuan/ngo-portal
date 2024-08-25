"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@@/ui/card";
import useSWR from "swr";
import { reportRequest } from "@/api-requests/report.request";
import { Report } from "@/schemas/report.schema";
import { ChartContainer } from "@@/ui/chart";
import { Bar, BarChart, LabelList, Rectangle, XAxis } from "recharts";
import dayjs from "dayjs";
import { cn, formatPrice } from "@/lib/utils";

const MonthRevenueCompareWidget = () => {
  const { data } = useSWR(
    "compare-month-revenue",
    reportRequest.get<Report.MonthRevenueCompare>,
  );

  const getPercentageString = (percent?: number) => {
    if (percent == 0) {
      return <p>Doanh thu vẫn ổn định trong 2 tháng gần đây</p>;
    }
    if (percent) {
      return (
        <p className="text-sm text-muted-foreground">
          Doanh thu đã {percent > 0 ? "tăng lên " : "giảm đi "}
          <span
            className={cn(
              percent > 0 ? "text-green-500" : "text-destructive",
              "text-lg",
            )}
          >
            {Math.abs(percent)}%
          </span>{" "}
          so với tháng trước.
        </p>
      );
    }
  };
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Biểu đồ 2 tháng gần đây</CardTitle>
        <CardDescription>
          Biểu đồ hiển thị sự đối chiếu giữa doanh thu tháng này và tháng trước
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer
          config={{
            month: {
              label: "Tháng",
              color: "hsl(var(--chart-1))",
            },
            revenue: {
              label: "Doanh thu",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[140px] w-4/5 mx-auto"
        >
          <BarChart accessibilityLayer data={data?.revenues} barSize={45}>
            <XAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value === dayjs().utc(true).format("YYYY-MM")
                  ? "Tháng này"
                  : "Tháng trước"
              }
            />
            <Bar
              dataKey="revenue"
              fill={"var(--color-revenue)"}
              fillOpacity={0.2}
              radius={4}
              activeIndex={1}
              activeBar={<Rectangle fillOpacity={0.85} />}
            >
              <LabelList
                position="top"
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatPrice(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row p-4 pt-0">
        {getPercentageString(data?.percentageChange)}
      </CardFooter>
    </Card>
  );
};

export default MonthRevenueCompareWidget;
