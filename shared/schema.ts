import { pgTable, text, timestamp, jsonb, uuid, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorName: text("author_name").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("comments_status_created_idx").on(t.status, t.createdAt.desc()),
    index("comments_created_at_idx").on(t.createdAt.desc()),
  ],
);

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("singleton"),
  data: jsonb("data").notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: text("id").primaryKey().default("singleton"),
  passwordHash: text("password_hash").notNull(),
  recoveryCodeHash: text("recovery_code_hash").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type AdminSettings = typeof adminSettings.$inferSelect;
