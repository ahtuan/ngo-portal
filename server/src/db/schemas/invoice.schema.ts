import {
  AnyPgColumn,
  boolean,
  decimal,
  integer,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { identityMixin, metaDataMixin, schema } from "@/db/schemas/mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { byKgCategories } from "@/db/schemas/category.schema";
import { sales } from "@/db/schemas/sale.schema";

export const invoices = schema.table("invoices", {
  ...identityMixin,
  id: serial("id").primaryKey(),
  byDateId: varchar("by_date_id", { length: 15 }).notNull().unique(),
  price: integer("price").notNull(),
  status: varchar("status", { length: 30 }).notNull(), // Creating,
  saleId: integer("sale_id").references(() => sales.id),
  isOnline: boolean("is_online").notNull().default(false),
  ...metaDataMixin,
  // Completed, Cancelled
});

export const invoiceRelation = relations(invoices, ({ many }) => ({
  items: many(invoiceItems),
  payments: many(payments),
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
  categoryId: integer("category_id").references(() => byKgCategories.id),
});

export const payments = schema.table("payments", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  paymentMethod: varchar("payment_method").notNull(),
  status: varchar("status", { length: 15 }).notNull(), // pending, complete,
  // failed
  amount: integer("amount").notNull(),
  paymentType: varchar("payment_type", { length: 15 }).notNull(), // "deposit"
  // (tiền cọc), "remaining" (tiền còn lại), "full" (đầy đủ)
  paymentDate: timestamp("payment_date"),
});
export type InvoiceItemSchema = typeof invoiceItems.$inferInsert;

export namespace InvoiceResponse {
  export type Sale = {
    condition: string | null;
    description: string | null;
    name: string;
    steps: string;
    isApplied: boolean;
  };
  export type InvoiceItemSelect = typeof invoiceItems.$inferSelect;
  export type InvoiceItem = {
    name: string;
    byDateId: string;
    quantity: number;
    price: number;
    total: number;
    sale?: Sale;
  };

  export type StackItem = {
    id: number;
    name: string;
    weight: number;
    price: number;
    total: number;
    items: InvoiceItem[];
    sale?: Sale;
    afterSale: number;
  };

  export type Invoice = {
    payments: Payment[];
  } & typeof invoices.$inferSelect;
  export type Detail = {
    actualPrice: number;
    afterSale: number;
    totalQuantity: number;
    totalPrice: number;
    byDateId: string;
    createdAt: Date | null;
    items: InvoiceItem[];
    stacks: StackItem[];
    sale?: Sale;
    status: string;
    payments: Payment[];
    isOnline: boolean;
  };

  export type InsertPayment = typeof payments.$inferInsert;
  export type Payment = Omit<typeof payments.$inferSelect, "id">;
}
