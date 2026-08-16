import { users } from "../db/schema/users.js";

declare global {
  namespace Express {
    interface Request {
      user: typeof users.$inferSelect;
    }
  }
}

export {};