import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";
import { generateAccessToken } from "../utils/jwt.js";

export const requestOtp = async (phoneNumber: string) => {
  // TODO: Implement OTP service provider
  return {
    message: "OTP sent successfully",
  };
};

export const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  name?: string,
) => {
  if (otp !== "123456") {
    throw new Error("Invalid OTP");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.phone_number, phoneNumber),
  });

  if (user) {
    return {
      accessToken: generateAccessToken(user.id),
      user,
    };
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const newUser = {
    id: uuid(),
    phone_number: phoneNumber,
    name,
  };

  await db.insert(users).values(newUser);

  return {
    accessToken: generateAccessToken(newUser.id),
    user: newUser,
  }
};