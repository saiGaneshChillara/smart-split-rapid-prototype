import { check, integer, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { expense_items } from "./expense_items.js";
import { users } from "./users.js";
import { sql } from "drizzle-orm";

export const expense_item_participants = pgTable(
  "expense_item_participants",
  {
    id: uuid("id").primaryKey(),
    expense_item_id: uuid("expense_item_id")
      .notNull()
      .references(() => expense_items.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    amount: integer("amount"),
    percentage: integer("percentage"),
  },
  (table) => [
    check(
      "participant_amount_or_percentage_not_both",
      sql`NOT (${table.amount} IS NOT NULL AND ${table.percentage} IS NOT NULL)`,
    ),
    check(
      "participant_amount_positive",
      sql`${table.amount} IS NULL OR ${table.amount} > 0`,
    ),
    check(
      "participant_percentage_valid",
      sql`${table.percentage} IS NULL OR (${table.percentage} > 0 AND ${table.percentage} <= 100)`,
    ),
    unique("expense_item_participant_unique").on(
      table.expense_item_id,
      table.user_id,
    ),
  ],
);