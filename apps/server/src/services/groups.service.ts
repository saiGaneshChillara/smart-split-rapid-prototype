import { db } from "../db/client.js";

import { v4 as uuid } from "uuid";
import { groups } from "../db/schema/groups.js";
import { group_members } from "../db/schema/group_members.js";
import { and, eq } from "drizzle-orm";
import { ApiError } from "../errors/ApiError.js";

export const createGroup = async (
  name: string,
  userId: string,
) => {
  return await db.transaction(async (tx) => {
    const groupId = uuid();

    const [group] = await tx
      .insert(groups)
      .values({
        id: groupId,
        name,
        created_by: userId,
      })
      .returning();

    await tx.insert(group_members).values({
      id: uuid(),
      group_id: groupId,
      user_id: userId,
      role: "ADMIN",
    });

    return {
      group,
    };
  });
};

export const listGroups = async (
  userId: string,
) => {
  const memberships = await db.query.group_members.findMany({
    where: eq(group_members.user_id, userId),
    with: {
      group: true,
    },
  });

  return {
    groups: memberships.map((membership) => ({
      ...membership.group,
      role: membership.role,
    })),
  };
};

export const getGroup = async (
  groupId: string,
  userId: string,
) => {
  const membership = await db.query.group_members.findFirst({
    where: and(
      eq(group_members.group_id, groupId),
      eq(group_members.user_id, userId),
    ),
  });

  
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    with: {
      members: {
        with: {
          user: true,
        },
      },
    },
  });
  
  if (!membership || !group) {
    throw new ApiError(404, "Group not found");
  }
  return {
    group: {
      id: group.id,
      name: group.name,
      created_by: group.created_by,
      created_at: group.created_at,
      updated_at: group.updated_at,
    },
    members: group.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      phone_number: member.user.phone_number,
      role: member.role,
    })),
  };
};