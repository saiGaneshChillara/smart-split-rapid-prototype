import { sql } from "drizzle-orm";
import { check, integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { expense_versions } from "./expense_versions.js";
import { users } from "./users.js";

export const expense_contributors = pgTable(
  "expense_contributors",
  {
    id: uuid("id").primaryKey(),
    expense_version_id: uuid("expense_version_id")
      .notNull()
      .references(() => expense_versions.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("expense_contributor_unique").on(
      table.expense_version_id,
      table.user_id,
    ),
    check(
      "expense_contributor_amount_positive",
      sql`${table.amount} > 0`
    ),
  ],
);