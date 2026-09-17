import { sql } from "drizzle-orm";
import { check, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { expense_versions } from "./expense_versions.js";

export const expenseItemSplitType = pgEnum("expense_item_split_type", [
  "EQUAL",
  "PERCENTAGE",
  "EXACT"
]);


export const expense_items = pgTable(
  "expense_items",
  {
    id: uuid("id").primaryKey(),
    expense_version_id: uuid("expense_version_id")
      .notNull()
      .references(() => expense_versions.id, { onDelete: "cascade" }),
    item_name: text("item_name").notNull(),
    amount: integer("amount").notNull(),
    split_type: expenseItemSplitType("split_type")
      .notNull()
      .default("EQUAL"),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "expense_item_amount_positive",
      sql`${table.amount} > 0`,
    ),
  ],
);