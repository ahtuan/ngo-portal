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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@@/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Separator } from "@@/ui/separator";
import { formatPrice } from "@/lib/utils";

const TodayWidget = () => {
  const { data } = useSWR(
    "today-insight",
    reportRequest.get<Report.TodayInsight>,
  );

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Hôm nay</CardTitle>
        <CardDescription>
          Thông tin doanh thu hôm nay và số lượng đơn hàng trực tiếp và trực
          tuyến theo trạng thái
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4 p-4 pb-2">
        <ChartContainer
          config={{
            completed: {
              label: "Xong",
              color: "#2A9D90",
            },
            pending: {
              label: "Chờ",
              color: "#E8C468",
            },
            refunded: {
              label: "Hoàn",
              color: "#E76E50",
            },
            canceled: {
              label: "Huỷ",
              color: "#274654",
            },
          }}
          className="h-[140px] w-full"
        >
          <BarChart accessibilityLayer data={data?.invoiceCount} barSize={30}>
            <CartesianGrid horizontal={false} />
            <XAxis
              dataKey="isOnline"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => (value ? "Trực tuyến" : "Trực tiếp")}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              labelFormatter={(label, payload) => {
                const currentData = payload[0].payload;
                const newLabel =
                  currentData.isOnline === 0 ? "Trực tuyến" : "Trực tiếp";
                const total = currentData.total as number;
                return (
                  <>
                    <div className="flex justify-around mx-[-1rem] mb-1">
                      <span>{newLabel}</span>
                      <span>{total}</span>
                    </div>
                    <Separator className="mb-1" />
                  </>
                );
              }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              align={"right"}
              layout={"vertical"}
              verticalAlign={"middle"}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="var(--color-completed)"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" />
            <Bar dataKey="refunded" stackId="a" fill="var(--color-refunded)" />
            <Bar
              dataKey="canceled"
              stackId="a"
              fill="var(--color-canceled)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4  text-muted-foreground">
        <div className="flex w-full items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Doanh thu</div>
            <div className="text-2xl font-bold tabular-nums leading-none">
              {formatPrice(data?.income?.amount)}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Tiền mặt</div>
            <div className="text-2xl font-bold tabular-nums leading-none">
              {formatPrice(data?.income?.cash)}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-xs text-muted-foreground">Chuyển khoản</div>
            <div className="text-2xl font-bold tabular-nums leading-none">
              {formatPrice(data?.income?.bank)}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodayWidget;
