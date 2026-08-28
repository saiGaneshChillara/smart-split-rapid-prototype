import { inArray } from "drizzle-orm";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";

export const searchUsers = async (
  phoneNumber: string[],
) => {
  const uniquePhoneNumbers = [... new Set(phoneNumber)];

  const existingUsers = await db.query.users.findMany({
    where: inArray(
      users.phone_number,
      uniquePhoneNumbers,
    ),
  });

  return {
    users: existingUsers.map((user) => ({
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
    })),
  };
};