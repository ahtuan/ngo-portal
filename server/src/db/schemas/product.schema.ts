import {
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestampMixin } from "./mixin";
import { inventories } from "@/db/schemas/inventory.schema";
import { categories } from "@/db/schemas/category.schema";

export const products = pgTable(
  "products",
  {
    ...timestampMixin,
    id: varchar("id", { length: 14 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    price: integer("price"),
    weight: decimal("weight"),
    imageUrl: varchar("image_url"),
    inventoryId: varchar("inventory_id", { length: 10 }).references(
      () => inventories.id,
    ),
    categoryId: integer("category_id").references(() => categories.id),
    // TODO Reference to Invoice Id
  },
  (t) => ({
    inventoryIdx: index("products_inventory_idx").on(t.inventoryId),
  }),
);
