import Elysia from "elysia";
import ReportService from "@/services/report.service";

export const reportController = new Elysia({
  name: "Controller.Report",
  prefix: "report",
})
  .decorate({
    reportService: new ReportService(),
  })
  .get(
    "/today-and-recent-income",
    async ({ reportService: service }) => await service.getRecentIncome(),
  );
