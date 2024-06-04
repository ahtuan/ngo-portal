import { integer, pgTable, index, varchar } from "drizzle-orm/pg-core";
import { metaDataMixin } from "./mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";

export const categories = pgTable(
  "categories",
  {
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description"),
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
