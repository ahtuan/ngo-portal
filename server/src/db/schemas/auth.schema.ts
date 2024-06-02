import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { metaDataMixin, timestampMixin } from "./mixin";
import { relations } from "drizzle-orm";

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 256 }),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  ...metaDataMixin,
});

export const accountsRelation = relations(accounts, ({ one, many }) => ({
  role: one(roles),
  sessions: many(sessions),
}));

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id),
  ...metaDataMixin,
});

export const rolesRelation = relations(roles, ({ many }) => ({
  rolesWithPermissions: many(rolesWithPermissions),
}));

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 256 }),
  description: varchar("description", { length: 256 }),
  ...timestampMixin,
});

export const permissionsRelation = relations(permissions, ({ many }) => ({
  rolesWithPermissions: many(rolesWithPermissions),
}));

export const rolesWithPermissions = pgTable(
  "rolesWithPermissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
  }),
);

export const roleWithPermissionsRelation = relations(
  rolesWithPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolesWithPermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolesWithPermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  expiredAt: timestamp("expired_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isValid: boolean("is_valid").notNull(),
  accountId: integer("account_id").references(() => accounts.id),
});
