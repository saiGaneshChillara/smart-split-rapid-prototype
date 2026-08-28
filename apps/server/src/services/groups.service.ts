import { db } from "../db/client.js";

import { v4 as uuid } from "uuid";
import { groups } from "../db/schema/groups.js";
import { group_members } from "../db/schema/group_members.js";
import { and, eq, inArray } from "drizzle-orm";
import { ApiError } from "../errors/ApiError.js";
import { users } from "../db/schema/users.js";

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

export const addMembers = async (
  groupId: string,
  requesterId: string,
  phoneNumbers: string[],
) => {
  // verify requester belongs to the group
  const requesterMembership = await db.query.group_members.findFirst({
    where: and(
      eq(group_members.group_id, groupId),
      eq(group_members.group_id, requesterId),
    ),
  });

  if (!requesterMembership) {
    throw new ApiError(404, "Group not found");
  }

  if (requesterMembership.role !== "ADMIN") {
    throw new ApiError(403, "Only admins can add members");
  }

  // find all existing users by phone number
  const existingUsers = await db.query.users.findMany({
    where: inArray(users.phone_number, phoneNumbers),
  });

  const existingMembers = await db.query.group_members.findMany({
    where: eq(group_members.group_id, groupId),
  });

  const existingMembersIds = new Set(
    existingMembers.map((member) => member.user_id),
  );

  const foundPhoneNumbers = new Set(
    existingUsers.map((user) => user.phone_number),
  );

  const added: typeof existingUsers = [];
  const alreadyMembers: typeof existingUsers = [];
  const notFound: string[] = [];

  const membersToInsert = [];

  for (const user of existingUsers) {
    if (existingMembersIds.has(user.id)) {
      alreadyMembers.push(user);
      continue;
    }

    membersToInsert.push({
      id: uuid(),
      group_id: groupId,
      user_id: user.id,
      role: "ADMIN" as const,
    });

    added.push(user);
  }

  for (const phoneNumber of phoneNumbers) {
    if (!foundPhoneNumbers.has(phoneNumber)) {
      notFound.push(phoneNumber);
    }
  }

  if (membersToInsert.length > 0) {
    await db.insert(group_members).values(membersToInsert);
  }

  return {
    summary: {
      added: added.length,
      alreadyMembers: alreadyMembers.length,
      notFound: notFound.length,
    },
    results: {
      added,
      alreadyMembers,
      notFound,
    }
  };
};