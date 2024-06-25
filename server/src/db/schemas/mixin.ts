import {
  pgSchema,
  serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const timestampMixin = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const byUserMixin = {
  createdBy: varchar("created_by", { length: 255 }).default("admin"),
  updatedBy: varchar("created_by", { length: 255 }).default("admin"),
};

export const metaDataMixin = {
  ...timestampMixin,
  ...byUserMixin,
  uuid: uuid("uuid").defaultRandom().notNull(),
  id: serial("id").primaryKey(),
};

export const schema = pgSchema("raw");
