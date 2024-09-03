import Elysia from "elysia";
import { reportService } from "@/services/report.service";
import dayjs from "dayjs";
import { reportModel } from "@/models/report.model";

export const reportController = new Elysia({
  name: "Controller.Report",
  prefix: "report",
})
  .decorate({
    reportService: reportService,
  })
  .use(reportModel)
  .get("/recent-income", async ({ reportService: service }) => {
    const now = dayjs().utc(true).endOf("date");
    const numberOfDays = 6;
    const fromDate = now.set("date", now.date() - numberOfDays).startOf("date");
    return await service.getPeriodRevenue(
      fromDate.format("YYYY-MM-DD"),
      now.format("YYYY-MM-DD"),
    );
  })
  .get(
    "today-insight",
    async ({ reportService: service }) => await service.getTodayInsight(),
  )
  .get(
    "/seed",
    async ({ reportService: service }) => await service.seedReport(),
  )
  .get(
    "/cron",
    async ({ reportService: service }) => await service.dailyPaymentCron(),
  )
  .get(
    "/compare-month-revenue",
    async ({ reportService: service }) => await service.getMonthCompare(),
  )
  .get(
    "period-revenue",
    async ({ reportService: service, query: { from, to } }) =>
      await service.getPeriodRevenue(from, to),
    {
      query: "period",
    },
  );
