import { ApiResponse } from "@/libs/api-response";

class ReportService {
  async getRecentIncome() {
    const data = [
      { date: "2024-01-01", amount: 2000 },
      { date: "2024-01-02", amount: 2100 },
      { date: "2024-01-03", amount: 2200 },
      { date: "2024-01-04", amount: 1300 },
      { date: "2024-01-05", amount: 1400 },
      { date: "2024-01-06", amount: 2500 },
      { date: "2024-08-06", amount: 1600 },
    ];
    return ApiResponse.success(data);
  }
}

export default ReportService;
