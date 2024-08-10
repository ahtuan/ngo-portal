import http from "@/lib/http";
import { Report } from "@/schemas/report.schema";

export const reportEndpoint = "/api/report";
export const reportRequest = {
  // TODO Optimise caching
  getTodayIncomeAndRecent: async (url: string) => {
    if (!url.startsWith("/api/report")) {
      url = `${reportEndpoint}/${url}`;
    }
    const response = await http.get<Report.RecentIncome[]>(url);
    return response.data;
  },
};
