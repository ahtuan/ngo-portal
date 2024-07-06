import {
  AnyPgColumn,
  decimal,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { identityMixin, metaDataMixin, schema } from "@/db/schemas/mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { categories } from "@/db/schemas/category.schema";

export const invoices = schema.table("invoices", {
  ...identityMixin,
  id: serial("id").primaryKey(),
  byDateId: varchar("by_date_id", { length: 15 }).notNull().unique(),
  price: integer("price").notNull(),
  paymentMethod: varchar("payment_method").notNull(), // Cash, Bank
  status: varchar("status", { length: 30 }).notNull(), // Creating,
  ...metaDataMixin,
  // Completed, Cancelled
});

export const invoiceRelation = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
}));

export const invoiceItems = schema.table("invoice_items", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references((): AnyPgColumn => invoiceItems.id),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  quantity: decimal("quantity").notNull(),
  price: integer("price").notNull(),
  saleId: integer("sale_id").references(() => sales.id),
  productId: integer("product_id").references(() => products.id),
  categoryId: integer("category_id").references(() => categories.id),
});

export const sales = schema.table("sales", {
  ...identityMixin,
  name: varchar("name", { length: 256 }),
  description: varchar("description"),
  steps: varchar("steps"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  ...metaDataMixin,
});

export const salesRelation = relations(sales, ({ one, many }) => ({
  items: many(invoiceItems),
}));

export type InvoiceItemSchema = typeof invoiceItems.$inferInsert;

export namespace InvoiceResponse {
  export type InvoiceItemSelect = typeof invoiceItems.$inferSelect;
  export type InvoiceItem = {
    name: string;
    byDateId: string;
    quantity: number;
    price: number;
    total: number;
  };

  export type StackItem = {
    id: number;
    name: string;
    weight: number;
    price: number;
    total: number;
    items: InvoiceItem[];
  };

  export type Invoice = typeof invoices.$inferSelect;
  export type Detail = {
    actualPrice: number;
    totalQuantity: number;
    totalPrice: number;
    byDateId: string;
    createdAt: Date | null;
    paymentType: string;
    items: InvoiceItem[];
    stacks: StackItem[];
  };
}
