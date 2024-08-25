import Elysia from "elysia";
import { cron } from "@elysiajs/cron";
import { reportService } from "@/services/report.service";

export const crons = new Elysia().use(
  cron({
    name: "dailyReportCron",
    pattern: "0 45 23 * * *",
    run() {
      reportService.dailyPaymentCron();
    },
  }),
);
