import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const env = {
  PORT,
  DATABASE_URL,
};
