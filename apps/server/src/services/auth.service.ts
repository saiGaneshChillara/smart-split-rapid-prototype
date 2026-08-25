import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";
import { ApiError } from "../errors/ApiError.js";
import { generateAccessToken } from "../utils/jwt.js";


export const requestOtp = async (phoneNumber: string) => {
  // TODO: Implement OTP service provider
  return {
    message: "OTP sent successfully",
  };
};

const DEV_STUB_OTP = "123456";

// TODO SECURITY: this is stub until a real OTP/SMS provider is wired up
export const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  name?: string,
) => {
  if (process.env.NODE_ENV === "production") {
    throw new ApiError(501, "OTP verification is not yet implemented");
  }

  if (otp !== DEV_STUB_OTP) {
    throw new ApiError(401, "Invalid OTP");
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
    return {
      requiresRegistration: true,
      phoneNumber,
    };
  }

  const [newUser] = await db
    .insert(users)
    .values({
      id: uuid(),
      phone_number: phoneNumber,
      name,
    })
    .returning();
  
  return {
    requiresRegistration: false,
    accessToken: generateAccessToken(newUser.id),
    user: newUser,
  }
};