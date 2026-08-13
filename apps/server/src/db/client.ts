import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";
import * as schema from "./schema/index.js";

const connectionString = env.DATABASE_URL;

const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, {
  schema,
});