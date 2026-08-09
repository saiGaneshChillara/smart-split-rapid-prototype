import { pgEnum, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { groups } from "./groups.js";
import { users } from "./users.js";

export const groupMemberRole = pgEnum("group_member_role", [
  "ADMIN",
  "MEMBER"
]);


export const group_members = pgTable(
  "group_members", 
  {
    id: uuid("id").primaryKey(),
    group_id: uuid("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: groupMemberRole("role").notNull().default("MEMBER"),
    joined_at: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("group_members_group_user_unique").on(
      table.group_id,
      table.user_id,
    ),
  ],
);