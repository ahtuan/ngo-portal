import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { byUserMixin, schema, timestampMixin } from "./mixin";
import { inventories } from "@/db/schemas/inventory.schema";
import { categories } from "@/db/schemas/category.schema";
import { invoiceItems } from "@/db/schemas/invoice.schema";
import { relations } from "drizzle-orm";
import { PRODUCT_STATUS_ENUM } from "@/constants/common";

export const productStatusEnum = pgEnum(
  "product_status_enum",
  // @ts-ignore
  Object.values(PRODUCT_STATUS_ENUM),
);
export const products = schema.table(
  "products",
  {
    ...timestampMixin,
    ...byUserMixin,
    id: serial("id").primaryKey(),
    byDateId: varchar("by_date_id", { length: 14 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    weight: decimal("weight").notNull(),
    imageUrls: varchar("image_url"),
    inventoryId: varchar("inventory_id", { length: 10 })
      .references(() => inventories.id)
      .notNull(),
    categoryId: integer("category_id").references(() => categories.id),
    categoryName: varchar("category_name"),
    status: productStatusEnum("status").notNull(), // READY, IN_STOCK, SOLD
    isArchived: boolean("is_archived").default(false), // Use for tracking
    // whether it was in stock or not able to sell and put in stock
    isUsedCategoryPrice: boolean("is_used_category_price").default(false),
    isSold: boolean("is_sold").default(false),
  },
  (t) => ({
    inventoryIdx: index("products_inventory_idx").on(t.inventoryId),
  }),
);

export const productRelation = relations(products, ({ one }) => ({
  invoiceItem: one(invoiceItems),
}));
