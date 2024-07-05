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
  updatedBy: varchar("updated_by", { length: 255 }).default("admin"),
};

export const identityMixin = {
  uuid: uuid("uuid").defaultRandom().notNull(),
  id: serial("id").primaryKey(),
};

export const metaDataMixin = {
  ...timestampMixin,
  ...byUserMixin,
};

export const schema = pgSchema("raw");
