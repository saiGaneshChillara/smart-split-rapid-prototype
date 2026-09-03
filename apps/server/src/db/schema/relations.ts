import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { group_members } from "./group_members.js";
import { groups } from "./groups.js";
import { expenses } from "./expenses.js";
import { expense_item_participants } from "./expense_item_participants.js";
import { expense_contributors } from "./expense_contributors.js";
import { expense_items } from "./expense_items.js";

export const usersRelations = relations(users, ({ many }) => ({
  groupMemberships: many(group_members),
  createdGroups: many(groups),
  createdExpenses: many(expenses),
  expenseParticipations: many(expense_item_participants),
  expenseContributions: many(expense_contributors),
}));

export const groupsRelations = relations(
  groups,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [groups.created_by],
      references: [users.id],
    }),
    members: many(group_members),
    expenses: many(expenses),
  }),
);

export const groupMembersRelations = relations(
  group_members,
  ({ one }) => ({
    user: one(users, {
      fields: [group_members.user_id],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [group_members.group_id],
      references: [groups.id],
    }),
  }),
);

export const expensesRelations = relations(
  expenses,
  ({ one, many }) => ({
    group: one(groups, {
      fields: [expenses.group_id],
      references: [groups.id],
    }),
    creator: one(users, {
      fields: [expenses.created_by],
      references: [users.id],
    }),
    contributors: many(expense_contributors),
    items: many(expense_items),
  }),
);

export const expenseContributorsRelations = relations(
  expense_contributors,
  ({ one }) => ({
    expense: one(expenses, {
      fields: [expense_contributors.expense_id],
      references: [expenses.id],
    }),
    contributor: one(users, {
      fields: [expense_contributors.user_id],
      references: [users.id],
    }),
  }),
);

export const expenseItemsRelations = relations(
  expense_items,
  ({ one, many }) => ({
    expense: one(expenses, {
      fields: [expense_items.expense_id],
      references: [expenses.id],
    }),
    participants: many(expense_item_participants),
  }),
);

export const expenseItemParticipantsRelations = relations(
  expense_item_participants,
  ({ one }) => ({
    expenseItem: one(expense_items, {
      fields: [expense_item_participants.expense_item_id],
      references: [expense_items.id],
    }),
    participant: one(users, {
      fields: [expense_item_participants.user_id],
      references: [users.id],
    }),
  }),
);