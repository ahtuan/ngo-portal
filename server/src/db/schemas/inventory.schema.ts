import {
  decimal,
  index,
  integer,
  pgEnum,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { metaDataMixin, schema } from "./mixin";
import { relations } from "drizzle-orm";
import { INVENTORY_ENUM } from "@/constants/common";
import { products } from "@/db/schemas/product.schema";

export const inventoryEnum = pgEnum(
  "inventory_enum",
  // @ts-ignore
  Object.values(INVENTORY_ENUM),
);

export const inventories = schema.table(
  "inventories",
  {
    ...metaDataMixin,
    id: varchar("id", { length: 10 }).notNull().primaryKey(),
    price: integer("price").notNull(),
    grossWeight: decimal("gross_weight").notNull(),
    actualWeight: decimal("actual_weight"),
    unit: varchar("unit", { length: 20 }).default("kg"),
    status: inventoryEnum("status").default(INVENTORY_ENUM.CREATED),
    source: text("source").notNull(),
    description: text("description"),
  },
  (t) => ({
    uuidIdx: index("inventories_uuid_idx").on(t.uuid),
  }),
);

export const inventoryRelation = relations(inventories, ({ many }) => ({
  products: many(products),
}));

type SelectInventory = typeof inventories.$inferSelect;
type InsertInventory = typeof inventories.$inferInsert;

export type InventoryType = Omit<SelectInventory, "id"> & {
  inStockWeight?: number;
};
export type InventoryCreateType = Omit<
  InsertInventory,
  "createdAt" | "updatedAt" | "id" | "uuid"
>;
export type InventoryUpdateType = Partial<InventoryCreateType>;
