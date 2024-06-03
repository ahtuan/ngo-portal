import { boolean, serial, timestamp, uuid } from "drizzle-orm/pg-core";

export const timestampMixin = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
};

export const metaDataMixin = {
  ...timestampMixin,
  uuid: uuid("uuid").defaultRandom(),
  id: serial("id").primaryKey(),
};
