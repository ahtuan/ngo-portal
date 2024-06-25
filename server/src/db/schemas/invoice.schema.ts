import {
  decimal,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  byUserMixin,
  metaDataMixin,
  schema,
  timestampMixin,
} from "@/db/schemas/mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";

export const invoices = schema.table("products", {
  ...timestampMixin,
  ...byUserMixin,
  id: serial("id").primaryKey(),
  byDateId: varchar("by_date_id", { length: 12 }).notNull().unique(),
  price: integer("price").notNull(),
  paymentMethod: varchar("payment_method").notNull(), // Cash, Bank
  status: varchar("status", { length: 30 }).notNull(), // Creating,
  // Completed, Cancelled
});

export const invoiceRelation = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItems = schema.table("invoice_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  quantity: decimal("quantity").notNull(),
  price: integer("price").notNull(),
  parentId: integer("parent_id"),
  saleId: integer("sale_id").references(() => sales.id),
  productId: integer("product_id").references(() => products.id),
});

export const sales = schema.table("sales", {
  ...metaDataMixin,
  name: varchar("name", { length: 256 }),
  description: varchar("description"),
  steps: varchar("steps"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const salesRelation = relations(sales, ({ one, many }) => ({
  items: many(invoiceItems),
}));
