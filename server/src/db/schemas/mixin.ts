import { boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const timestampMixin = {
  isActive: boolean("is_active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const metaDataMixin = {
  ...timestampMixin,
  uuid: uuid("uuid").defaultRandom(),
};
