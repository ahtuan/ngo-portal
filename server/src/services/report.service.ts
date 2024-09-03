import { ApiResponse } from "@/libs/api-response";
import db from "@/db";
import {
  InvoiceResponse,
  invoices,
  payments,
} from "@/db/schemas/invoice.schema";
import {
  INVOICE_STATUS_ENUM,
  PAYMENT_METHOD_ENUM,
  PAYMENT_STATUS,
} from "@/constants/common";
import { reports } from "@/db/schemas/report.schema";
import { and, asc, count, eq, gt, lte, sql, sum } from "drizzle-orm";
import { getCurrentDate, getDateFormat } from "@/libs/date";
import dayjs from "dayjs";
import { fixed } from "@/libs/helpers";

class ReportService {
  async getTodayInsight() {
    const todayIncome = await this.todayIncome();

    const data = await db
      .select({
        count: count(),
        status: invoices.status,
        isOnline: invoices.isOnline,
      })
      .from(invoices)
      .where(eq(sql`date(${invoices.createdAt})`, getDateFormat()))
      .groupBy(invoices.status, invoices.isOnline);

    const mappedInvoices = (data: any[], isOnline: number = 1) => {
      const counts: Report.InvoiceCountStatus = {
        isOnline,
        total: 0,
      };
      data.map((item) => {
        counts.total += item.count;
        switch (item.status) {
          case INVOICE_STATUS_ENUM.COMPLETE:
            counts.completed = (counts.completed || 0) + item.count;
            break;
          case INVOICE_STATUS_ENUM.REFUNDED:
            counts.refunded = (counts.refunded || 0) + item.count;
            break;
          case INVOICE_STATUS_ENUM.CANCELLED:
            counts.canceled = (counts.canceled || 0) + item.count;
            break;
          default:
            counts.pending = (counts.pending || 0) + item.count;
        }
      });
      return counts;
    };

    const mappedChart: Report.InvoiceCountStatus[] = [];
    const online = mappedInvoices(data.filter((item) => item.isOnline));
    const offline = mappedInvoices(
      data.filter((item) => !item.isOnline),
      0,
    );

    mappedChart.push(online, offline);
    const resultObj = {
      income: todayIncome,
      invoiceCount: mappedChart,
    };
    return ApiResponse.success(resultObj);
  }

  // async getRecentIncome() {
  //   const now = dayjs().utc(true).endOf("date");
  //   const numberOfDays = 6;
  //   const fromDate = now
  //     .set("date", now.date() - numberOfDays)
  //     .startOf("date")
  //     .toDate();
  //   const result = await this.getPeriodIncome(fromDate, now.toDate());
  //   return ApiResponse.success(result);
  // }

  async getPeriodRevenue(from: string, to?: string) {
    console.log({
      from: from,
      to: to,
    });
    const toDate = dayjs(to).utc(true).endOf("date").toDate();
    const fromDate = dayjs(from).utc(true).startOf("date").toDate();
    console.log({
      fromDate: fromDate,
      toDate: toDate,
    });
    const rawReports = await db
      .select({
        date: reports.byDateId,
        amount: reports.amount,
        cash: reports.cash,
        bank: reports.bank,
      })
      .from(reports)
      .where(and(gt(reports.byDateId, fromDate), lte(reports.byDateId, toDate)))
      .orderBy(asc(reports.byDateId));

    // Generate an array of the 7 most recent dates
    const recentDates = this.getDateInPeriod(fromDate, toDate);

    // Fill in the missing dates with default data
    const newFilledArray = await Promise.all(
      recentDates.map(async (date) => {
        if (date === getDateFormat()) {
          const todayIncome = await this.todayIncome();
          return {
            date: getDateFormat(date, true),
            amount: todayIncome.amount,
            cash: todayIncome.cash,
            bank: todayIncome.bank,
          };
        }
        const existingItem = rawReports.find(
          (item) => getDateFormat(item.date, true) === date,
        );

        return {
          date: getDateFormat(existingItem?.date || date, true),
          amount: existingItem?.amount || 0,
          cash: existingItem?.cash || 0,
          bank: existingItem?.bank || 0,
        };
      }),
    );
    return ApiResponse.success(newFilledArray);
  }

  async seedReport() {
    const rawPayments = await db.query.payments.findMany({
      where: (payment, { isNotNull }) => isNotNull(payment.paymentDate),
      orderBy: (payment, { asc }) => asc(payment.paymentDate),
    });

    const groupBy = rawPayments.reduce((prev, cur) => {
      if (cur.paymentDate) {
        const curDate = getDateFormat(cur.paymentDate);
        const valueArr = prev.get(curDate) || [];
        valueArr.push(cur);
        prev.set(curDate, valueArr);
      }

      return prev;
    }, new Map());

    const mapped = Array.from(groupBy).map(
      ([key, valueArray]: [string, InvoiceResponse.Payment[]]) => {
        const { amount, cash, bank } = this.sumPayment(valueArray);

        return {
          byDateId: dayjs(key).utc(true).toDate(),
          amount,
          cash,
          bank,
        };
      },
    );

    await db.insert(reports).values(mapped);
    return ApiResponse.success(mapped);
  }

  async dailyPaymentCron() {
    console.info("Start daily payment cron");
    const currentDate = getDateFormat();

    const todayReport = await this.todayIncome();
    if (todayReport.amount == 0) {
      return ApiResponse.error("No payment data to insert report");
    }

    const report = await db.query.reports.findFirst({
      where: (report, { eq }) => eq(sql`date(${report.byDateId})`, currentDate),
    });
    if (report) {
      await db
        .update(reports)
        .set({
          amount: todayReport.amount,
          cash: todayReport.cash,
          bank: todayReport.bank,
          updatedAt: getCurrentDate(),
        })
        .where(eq(sql`date(${reports.byDateId})`, currentDate));
    } else {
      await db.insert(reports).values(todayReport);
    }

    console.info("Completed daily payment cron");
    console.debug("Report daily payment cron", todayReport);
    return ApiResponse.success(todayReport);
  }

  async getMonthCompare() {
    const now = dayjs().utc(true);
    const pre = now.set("month", now.month() - 1);

    const sumCurrentMonth = await db
      .select({
        sum: sum(payments.amount),
      })
      .from(payments)
      .where(
        eq(
          sql`TO_CHAR(DATE(${payments.paymentDate}), 'YYYY-MM')`,
          getDateFormat(now, true, "YYYY-MM"),
        ),
      );
    const sumPrevMonth = await db
      .select({
        sum: sum(payments.amount),
      })
      .from(payments)
      .where(
        eq(
          sql`TO_CHAR(DATE(${payments.paymentDate}), 'YYYY-MM')`,
          getDateFormat(pre, true, "YYYY-MM"),
        ),
      );
    const currentMonthRevenue = +(sumCurrentMonth[0].sum || 0);
    const prevMonthRevenue = +(sumPrevMonth[0].sum || 0);
    const revenues = [
      {
        month: pre.format("YYYY-MM"),
        revenue: prevMonthRevenue,
      },
      {
        month: now.format("YYYY-MM"),
        revenue: currentMonthRevenue,
      },
    ];
    const percentageChange = fixed(
      ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100,
      0,
    );
    const resultObj: Report.MonthRevenueCompare = {
      revenues,
      percentageChange,
    };
    return ApiResponse.success(resultObj);
  }

  private sumPayment(valueArray: InvoiceResponse.Payment[]) {
    return valueArray.reduce(
      (prev, cur) => {
        prev.amount += cur.amount;

        if (cur.paymentMethod === PAYMENT_METHOD_ENUM.BANK) {
          prev.bank += cur.amount;
        } else if (cur.paymentMethod === PAYMENT_METHOD_ENUM.CASH) {
          prev.cash += cur.amount;
        }

        return prev;
      },
      {
        amount: 0,
        cash: 0,
        bank: 0,
      },
    );
  }

  private async todayIncome(date?: string) {
    const currentDate = date || getDateFormat();

    const rawPayments = await db.query.payments.findMany({
      where: (payment, { eq, and }) =>
        and(
          eq(sql`date(${payment.paymentDate})`, currentDate),
          eq(payment.status, PAYMENT_STATUS.COMPLETE),
        ),
    });
    const { amount, cash, bank } = this.sumPayment(rawPayments);
    const todayReport = {
      byDateId: dayjs(currentDate).utc(true).toDate(),
      amount,
      cash,
      bank,
    };
    return todayReport;
  }

  private getDateInPeriod(startDate: Date, endDate: Date) {
    const dates: string[] = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dates.push(getDateFormat(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
}

export const reportService = new ReportService();
