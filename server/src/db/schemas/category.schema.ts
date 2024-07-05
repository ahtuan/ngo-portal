import {
  index,
  integer,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { identityMixin, metaDataMixin, schema } from "./mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { UNIT_ENUM } from "@/constants/common";

export const categories = schema.table(
  "categories",
  {
    ...identityMixin,
    name: varchar("name", { length: 256 }).notNull(),
    price: integer("cate_price"),
    unit: varchar("unit", { length: 10 }).default(UNIT_ENUM.PCS),
    ...metaDataMixin,
  },
  (t) => ({
    uuidIdx: index("categories_uuid_idx").on(t.uuid),
  }),
);

export const categoryRelation = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const byKgCategories = schema.table(
  "by_kg_categories",
  {
    id: serial("by_kg_id").primaryKey(),
    uuid: uuid("by_kg_uuid").defaultRandom().notNull(),
    name: varchar("by_kg_name", { length: 256 }).notNull(),
    price: integer("by_kg_price"),
    unit: varchar("by_kg_unit", { length: 10 }).default(UNIT_ENUM.KG),
    createdAt: timestamp("by_kg_created_at").defaultNow(),
    updatedAt: timestamp("by_kg_updated_at").defaultNow(),
    createdBy: varchar("by_kg_created_by", { length: 255 }).default("admin"),
    updatedBy: varchar("by_kg_updated_by", { length: 255 }).default("admin"),
  },
  (t) => ({
    uuidIdx: index("by_kg_categories_uuid_idx").on(t.uuid),
  }),
);

export const byKgCategoryRelation = relations(byKgCategories, ({ many }) => ({
  products: many(products),
}));
