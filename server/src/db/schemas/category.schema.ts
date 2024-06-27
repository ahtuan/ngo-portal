import {
  index,
  integer,
  pgEnum,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { metaDataMixin, schema } from "./mixin";
import { relations } from "drizzle-orm";
import { products } from "@/db/schemas/product.schema";
import { UNIT_ENUM } from "@/constants/common";

export const unitEnum = pgEnum(
  "unit_enum",
  // @ts-ignore
  Object.values(UNIT_ENUM),
);

export const categories = schema.table(
  "categories",
  {
    name: varchar("name", { length: 256 }).notNull(),
    price: integer("cate_price"),
    unit: unitEnum("unit").default(UNIT_ENUM.PCS),
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
    name: varchar("by_kg_name", { length: 256 }).notNull(),
    price: integer("by_kg_price"),
    uuid: uuid("by_kg_uuid").defaultRandom().notNull(),
    id: serial("by_kg_id").primaryKey(),
    createdAt: timestamp("by_kg_created_at").defaultNow(),
    updatedAt: timestamp("by_kg_updated_at").defaultNow(),
    createdBy: varchar("by_kg_created_by", { length: 255 }).default("admin"),
    updatedBy: varchar("by_kg_updated_by", { length: 255 }).default("admin"),
    unit: unitEnum("by_kg_unit").default(UNIT_ENUM.KG),
  },
  (t) => ({
    uuidIdx: index("by_kg_categories_uuid_idx").on(t.uuid),
  }),
);

export const byKgCategoryRelation = relations(byKgCategories, ({ many }) => ({
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
