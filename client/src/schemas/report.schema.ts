export namespace Report {
  export type Income = {
    date: string;
    amount: number;
    bank: number;
    cash: number;
  };
  type InvoiceStatusCount = {
    count: number;
    status: string;
    isOnline: boolean;
  };
  export type TodayInsight = {
    income: Income;
    invoiceCount: InvoiceStatusCount[];
  };

  type Revenue = {
    month: string;
    revenue: number;
  };
  export type MonthRevenueCompare = {
    revenues: Revenue[];
    percentageChange: number;
  };
  // export type Keep = z.TypeOf<typeof InvoiceKeepSchema>;
}
