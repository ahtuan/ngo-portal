import Elysia from "elysia";
import { reportService } from "@/services/report.service";

export const reportController = new Elysia({
  name: "Controller.Report",
  prefix: "report",
})
  .decorate({
    reportService: reportService,
  })
  .get(
    "/recent-income",
    async ({ reportService: service }) => await service.getRecentIncome(),
  )
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
  );
