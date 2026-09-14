import { boolean, index, integer, pgTable, text, timestamp, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { expenses } from "./expenses.js";
import { users } from "./users.js";
import { sql } from "drizzle-orm";

export const expense_versions = pgTable(
  "expense_versions",
  {
    id: uuid("id").primaryKey(),

    expense_id: uuid("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),

    version: integer("version").notNull(),

    description: text("description").notNull(),

    is_current: boolean("is_current").notNull().default(true),

    edited_by: uuid("edited_by")
      .references(() => users.id, { onDelete: "set null" }),
    
    created_at: timestamp("created_at", {
      withTimezone: true,
    }).notNull().defaultNow(),
  },
  (table) => [
    unique("expense_version_unique").on(
      table.expense_id,
      table.version,
    ),

    uniqueIndex("expense_version_current_unique")
      .on(table.expense_id)
      .where(sql`${table.is_current} = true`),
  ],
);