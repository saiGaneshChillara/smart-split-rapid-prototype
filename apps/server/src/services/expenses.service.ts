import { and, eq, inArray } from "drizzle-orm";
import { db } from "../db/client.js";
import { CreateExpenseInput } from "../schemas/expenses.schema.js";
import { group_members } from "../db/schema/group_members.js";
import { ApiError } from "../errors/ApiError.js";
import { v4 as uuid } from "uuid";
import { expenses } from "../db/schema/expenses.js";
import { expense_contributors } from "../db/schema/expense_contributors.js";
import { expense_items } from "../db/schema/expense_items.js";
import { expense_item_participants } from "../db/schema/expense_item_participants.js";

export const addExpense = async (
  groupId: string,
  requesterId: string,
  input: CreateExpenseInput,
) => {
  // verify group exists and the requester belongs to the group
  const requesterMembership = await db
    .query
    .group_members
    .findFirst({
      where: and(
        eq(group_members.group_id, groupId),
        eq(group_members.user_id, requesterId),
      ),
    });

  if (!requesterMembership) {
    throw new ApiError(404, "Group not found")
  }

  // verify all contributors & participants belong to the gorup
  const participants = input.expenseItems.flatMap(
    item => item.participants.map(p => p.userId)
  );
  const contributors = input.contributors.map(c => c.userId);

  const allUsers = [
    ...new Set([
      ...participants,
      ...contributors,
    ]),
  ];

  const existingMembers = await db.query.group_members.findMany({
    where: and(
      eq(group_members.group_id, groupId),
      inArray(group_members.user_id, allUsers),
    ),
  });

  if (existingMembers.length !== allUsers.length) {
    throw new ApiError(400, "All users must belong to the group");
  }

  let expenseTotal = 0;

  for (const item of input.expenseItems) {
    const splitType = item.splitType;
    expenseTotal += item.amount;

    switch (splitType) {
      case "EQUAL": {
        const totalAmount = item.amount;
        const numParticipants = item.participants.length;
        const equalShare = Math.floor(totalAmount / numParticipants);
        const remainingShare = totalAmount % numParticipants;

        for (const participant of item.participants) {
          if (participant.amount !== undefined || participant.percentage !== undefined) {
            throw new ApiError(400, "Invalid participant data for EQUAL split");
          }
          participant.amount = equalShare;
        }

        for (let i = 0; i < remainingShare; i++) {
          item.participants[i].amount = (item.participants[i].amount || 0) + 1;
        }

        break;
      }
      case "EXACT": {
        let totalExpenseAmount = 0;

        for (const participant of item.participants) {
          if (participant.amount === undefined || participant.percentage !== undefined) {
            throw new ApiError(400, "Invalid participant data for EXACT split");
          } else {
            totalExpenseAmount += participant.amount;
          }
        }

        if (totalExpenseAmount !== item.amount) {
          throw new ApiError(400, "Sum of participant amounts does not equal total expense amount");
        }
        break;
      }
      case "PERCENTAGE": {
        let totalPercentage = 0;

        for (const participant of item.participants) {
          if (participant.percentage === undefined || participant.amount !== undefined) {
            throw new ApiError(400, "Invalid participant data for PERCENTAGE split");
          } else {
            totalPercentage += participant.percentage;
          }
        }

        const EPSILON = 0.000001;

        if (Math.abs(totalPercentage - 100) > EPSILON) {
          throw new ApiError(400, "Participants percentage sum must be 100");
        }

        const calculatedParticipants = item.participants.map((participant, index) => {
          const exactShare = item.amount * (participant.percentage! / 100);
          const floorAmount = Math.floor(exactShare);
          const fractionalRemainder = exactShare - floorAmount;

          return {
            participant,
            originalIndex: index,
            floorAmount,
            fractionalRemainder,
            exactShare,
          };
        });

        const allocatedAmount = calculatedParticipants.reduce((sum, p) => sum + p.floorAmount, 0);

        const remainingAmount = item.amount - allocatedAmount;

        calculatedParticipants.sort((a, b) => {
          if (a.fractionalRemainder !== b.fractionalRemainder) {
            return b.fractionalRemainder - a.fractionalRemainder;
          } else {
            return a.originalIndex - b.originalIndex;
          }
        });

        for (let i = 0; i < remainingAmount; i++) {
          calculatedParticipants[i].floorAmount += 1;
        }

        calculatedParticipants.sort((a, b) => a.originalIndex - b.originalIndex);

        for (const { participant, floorAmount } of calculatedParticipants) {
          participant.amount = floorAmount;
        }

        break;
      }
    }
    // After switch every expenseItem must have valid integer amount
  }

  const contributorsTotal = input.contributors.reduce((sum, acc) => sum + acc.amount, 0);

  if (expenseTotal !== contributorsTotal) {
    throw new ApiError(400, "Expense total must match with contributors total");
  }

  return await db.transaction(async (tx) => {
    const expenseId = uuid();

    await tx
      .insert(expenses)
      .values({
        id: expenseId,
        group_id: groupId,
        description: input.description,
        created_by: requesterId,
      });

    const contributorsValues = input.contributors.map(
      contributor => ({
        id: uuid(),
        expense_id: expenseId,
        user_id: contributor.userId,
        amount: contributor.amount,
      })
    );

    const expenseItemsWithIds = input.expenseItems.map(
      item => ({
        id: uuid(),
        item,
      })
    );

    const expenseItemsValues = expenseItemsWithIds.map(
      expenseItemWithId => ({
        id: expenseItemWithId.id,
        expense_id: expenseId,
        item_name: expenseItemWithId.item.name,
        amount: expenseItemWithId.item.amount,
        split_type: expenseItemWithId.item.splitType,
      })
    );

    const expenseItemParticipantsValues = expenseItemsWithIds.flatMap(
      expenseItemWithId => expenseItemWithId.item.participants.map(
        participant => ({
          id: uuid(),
          expense_item_id: expenseItemWithId.id,
          user_id: participant.userId,
          amount: participant.amount,
        }),
      ),
    );

    await tx
      .insert(expense_contributors)
      .values(contributorsValues);
    
    await tx
      .insert(expense_items)
      .values(expenseItemsValues);
    
    await tx
      .insert(expense_item_participants)
      .values(expenseItemParticipantsValues);

    return {
      expenseId,
    };
  });
};

export const getExpense = async (
  groupId: string,
  expenseId: string,
  userId: string,
) => {

  const membership = await db.query.group_members.findFirst({
    where: and(
      eq(group_members.group_id, groupId),
      eq(group_members.user_id, userId),
    ),
  });

  if (!membership) {
    throw new ApiError(404, "Group not found");
  }

  const expense = await db.query.expenses.findFirst({
    where: and(
      eq(expenses.id, expenseId),
      eq(expenses.group_id, groupId),
    ),
    with: {
      creator: true,
      contributors: {
        with: {
          contributor: true,
        }
      },
      items: {
        with: {
          participants: {
            with: {
              participant: true,
            }
          },
        },
      }
    }
  });

  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return {
    expense: {
      id: expense.id,
      description: expense.description,
      created_at: expense.created_at,
      created_by: {
        id: expense.creator?.id,
        name: expense.creator?.name,
      },
    },
    contributors: expense.contributors.map(contributor => ({
      id: contributor.user_id,
      amount: contributor.amount,
      name: contributor.contributor.name,
    })),
    expense_items: expense.items.map((item) => ({
      id: item.id,
      item_name: item.item_name,
      amount: item.amount,
      split_type: item.split_type,
      participants: item.participants.map(participant => ({
        id: participant.user_id,
        amount: participant.amount,
        name: participant.participant.name,
      })),
    })),
  };
};