import { ApiError } from "../errors/ApiError.js";
import { ExpenseCursor, expenseCursorSchema } from "../schemas/pagination.schema.js";

export const decodeExpenseCursor = (
  cursor: string,
): ExpenseCursor => {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");

    const parsed = JSON.parse(decoded);

    return expenseCursorSchema.parse(parsed);
  } catch {
    throw new ApiError(400, "Invalid cursor");
  }
};

export const encodeExpenseCursor = (
  cursor: ExpenseCursor,
): string => {
  const json = JSON.stringify(cursor);

  return Buffer.from(json, "utf-8").toString("base64url");
};