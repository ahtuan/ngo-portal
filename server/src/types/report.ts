declare namespace Report {
  type InvoiceCountStatus = {
    isOnline: number; // bit
    completed?: number;
    refunded?: number;
    pending?: number;
    canceled?: number;
    total: number;
  };

  type Revenue = {
    month: string;
    revenue: number;
  };
  type MonthRevenueCompare = {
    revenues: Revenue[];
    percentageChange: number;
  };
}
