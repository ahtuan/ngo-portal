import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { metaDataMixin } from "./mixin";
import { relations } from "drizzle-orm";
import { INVENTORY_ENUM } from "@/constants/common";
import { products } from "@/db/schemas/product.schema";

export const inventoryEnum = pgEnum(
  "inventory_enum",
  // @ts-ignore
  Object.values(INVENTORY_ENUM),
);

export const inventories = pgTable(
  "inventories",
  {
    ...metaDataMixin,
    name: varchar("name", { length: 256 }).notNull(),
    price: integer("price").notNull(),
    grossWeight: decimal("gross_weight").notNull(),
    actualWeight: decimal("actual_weight"),
    unit: varchar("unit", { length: 20 }).default("kg"),
    status: inventoryEnum("status").default(INVENTORY_ENUM.CREATED),
  },
  (t) => ({
    uuidIdx: index("inventories_uuid_idx").on(t.uuid),
  }),
);

export const inventoryRelation = relations(inventories, ({ many }) => ({
  deliveries: many(inventoryDeliveries),
  products: many(products),
}));

export const inventoryDeliveries = pgTable(
  "inventory_deliveries",
  {
    ...metaDataMixin,
    note: text("note"),
    date: timestamp("date").notNull(),
    inventoryID: integer("inventory_id").references(() => inventories.id),
  },
  (t) => ({
    uuidIdx: index("inventory_deliveries_uuid_idx").on(t.uuid),
  }),
);
