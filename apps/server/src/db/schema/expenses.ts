import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { groups } from "./groups.js";
import { users } from "./users.js";

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey(),
  group_id: uuid("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "restrict" }),
  created_by: uuid("created_by")
    .references(() => users.id, { onDelete: "set null" }),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});