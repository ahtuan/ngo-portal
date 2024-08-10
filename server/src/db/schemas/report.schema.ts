import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { schema } from "@/db/schemas/mixin";

export const report = schema.table("report", {
  id: serial("id").primaryKey(),
  byDateId: varchar("by_date_id", { length: 10 }).notNull().unique(),
  amount: integer("price").notNull(), // amount = cash + bank => positive
  cash: integer("cash").notNull(),
  bank: integer("bank").notNull(),
  shippingFee: integer("shippingFee").notNull(), // always negative number
  investAmount: integer("investAmount").notNull(), // Số tiền dùng để nhập
  // hàng => always negative number
});

export namespace ReportResponse {}
