import { AnyPgColumn, check, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { expenses } from "./expenses.js";
import { sql } from "drizzle-orm";

export const expenseItemSplitType = pgEnum("expense_item_split_type", [
  "EQUAL",
  "PERCENTAGE",
  "EXACT"
]);


export const expense_items = pgTable(
  "expense_items",
  {
    id: uuid("id").primaryKey(),
    expense_id: uuid("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    parent_item_id: uuid("parent_item_id")
      .references((): AnyPgColumn => expense_items.id, { onDelete: "cascade" }),
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