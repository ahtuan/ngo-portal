import { identityMixin, metaDataMixin, schema } from "@/db/schemas/mixin";
import { boolean, index, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { invoiceItems } from "@/db/schemas/invoice.schema";

export const sales = schema.table(
  "sales",
  {
    ...identityMixin,
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    steps: varchar("steps", { length: 256 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").notNull(),
    condition: varchar("condition", { length: 256 }),
    useForKgCateIds: varchar("use_for_kg_cate_ids"),
    isInvoiceOnly: boolean("is_invoice_only"),
    ...metaDataMixin,
  },
  (t) => ({
    uuidIdx: index("sales_uuid_idx").on(t.uuid),
  }),
);

export const salesRelation = relations(sales, ({ one, many }) => ({
  items: many(invoiceItems),
}));

export namespace SaleDB {
  export type RawSale = typeof sales.$inferSelect;

  export type Sale = {
    categoriesName?: string;
    useForKgCateIds?: string[];
  } & Omit<
    RawSale,
    | "id"
    | "createdAt"
    | "createdBy"
    | "updatedAt"
    | "updatedBy"
    | "useForKgCateIds"
  >;

  type RawInsert = typeof sales.$inferInsert;
  export type Update = Partial<Pick<RawInsert, "isActive" | "useForKgCateIds">>;
}
