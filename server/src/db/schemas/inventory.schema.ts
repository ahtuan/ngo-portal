import { decimal, index, integer, text, varchar } from "drizzle-orm/pg-core";
import { identityMixin, metaDataMixin, schema } from "./mixin";
import { relations } from "drizzle-orm";
import { INVENTORY_ENUM } from "@/constants/common";
import { products } from "@/db/schemas/product.schema";

export const inventories = schema.table(
  "inventories",
  {
    ...identityMixin,
    id: varchar("id", { length: 10 }).notNull().primaryKey(),
    description: text("description"),
    source: text("source").notNull(),
    price: integer("price").notNull(),
    grossWeight: decimal("gross_weight").notNull(),
    actualWeight: decimal("actual_weight").notNull(),
    status: varchar("status", { length: 20 }).default(INVENTORY_ENUM.CREATED),
    unit: varchar("unit", { length: 20 }).default("kg"),
    pricePerKg: integer("price_per_kg").notNull().default(0),
    ...metaDataMixin,
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
  "createdAt" | "updatedAt" | "id" | "uuid" | "pricePerKg"
>;
export type InventoryUpdateType = Partial<
  InventoryCreateType & {
    pricePerKg: number;
  }
>;

export namespace InventoryResponse {
  export type Report = {
    quantity: number;
    weight: number;
    actualWeight: number;
    price: number;
    estimatedPrice: number;
  };
  export type RawSelect = SelectInventory;
}
