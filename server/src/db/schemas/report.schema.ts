import { date, integer, serial } from "drizzle-orm/pg-core";
import { schema, timestampMixin } from "@/db/schemas/mixin";

export const reports = schema.table("reports", {
  id: serial("id").primaryKey(),
  byDateId: date("by_date_id", {
    mode: "date",
  })
    .notNull()
    .unique(),
  amount: integer("price").notNull(), // amount = cash + bank => positive
  cash: integer("cash").notNull(),
  bank: integer("bank").notNull(),
  ...timestampMixin,
});

export namespace ReportResponse {}
