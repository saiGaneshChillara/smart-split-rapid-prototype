import { z } from "zod";

export const expensePaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().min(1).optional(),
});

export const expenseCursorSchema = z.object({
  createdAt: z.coerce.date(),
  id: z.uuid(),
});

export type ExpensePaginationInput = z.infer<typeof expensePaginationSchema>;

export type ExpenseCursor = z.infer<typeof expenseCursorSchema>;