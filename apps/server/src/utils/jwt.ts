import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET);
};