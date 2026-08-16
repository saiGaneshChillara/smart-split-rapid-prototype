import type { StringValue } from "ms";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const DATABASE_URL = process.env.DATABASE_URL;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

if (!JWT_EXPIRES_IN) {
  throw new Error("JWT_EXPIRES_IN is not defined");
}

export const env = {
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN as StringValue,
};
