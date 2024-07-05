import {
  boolean,
  decimal,
  index,
  integer,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { metaDataMixin, schema } from "./mixin";
import { inventories } from "@/db/schemas/inventory.schema";
import { byKgCategories, categories } from "@/db/schemas/category.schema";
import { invoiceItems } from "@/db/schemas/invoice.schema";
import { relations } from "drizzle-orm";

export const products = schema.table(
  "products",
  {
    id: serial("id").primaryKey(),
    byDateId: varchar("by_date_id", { length: 14 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    price: integer("price"),
    weight: decimal("weight").notNull(),
    quantity: integer("quantity").notNull(),
    soldOut: integer("sold_out").notNull().default(0),
    inventoryId: varchar("inventory_id", { length: 10 })
      .references(() => inventories.id)
      .notNull(),
    categoryId: integer("category_id").references(() => categories.id),
    categoryName: varchar("category_name"),
    categoryIdByKg: integer("category_id_by_kg").references(
      () => byKgCategories.id,
    ),
    isUsedCategoryPrice: boolean("is_used_category_price").default(false),
    status: varchar("status", { length: 20 }).notNull(), // READY, IN_STOCK, SOLD
    isArchived: boolean("is_archived").default(false), // Use for tracking
    imageUrls: varchar("image_url"),
    // whether it was in stock or not able to sell and put in stock
    ...metaDataMixin,
  },
  (t) => ({
    inventoryIdx: index("products_inventory_idx").on(t.inventoryId),
  }),
);

export const productRelation = relations(products, ({ one }) => ({
  invoiceItem: one(invoiceItems),
}));
