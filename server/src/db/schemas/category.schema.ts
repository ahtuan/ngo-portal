import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { metaDataMixin } from "./mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";

export const categories = pgTable(
  "categories",
  {
    name: varchar("name", { length: 256 }).notNull(),
    price: integer("price"),
    ...metaDataMixin,
  },
  (t) => ({
    uuidIdx: index("categories_uuid_idx").on(t.uuid),
  }),
);

export const categoryRelation = relations(categories, ({ many }) => ({
  products: many(products),
}));

type SelectCategory = typeof categories.$inferSelect;
type InsertCategory = typeof categories.$inferInsert;

export type CategoryType = Omit<SelectCategory, "id">;
export type CategoryCreateType = Omit<
  InsertCategory,
  "id" | "createdAt" | "updatedAt"
>;
export type CategoryUpdateType = Partial<CategoryCreateType>;
