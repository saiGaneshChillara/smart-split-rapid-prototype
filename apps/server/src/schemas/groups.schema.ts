import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name is required")
    .max(100, "Group name must be at most 100 characters long"),
});

export const groupParamsSchema = z.object({
  groupId: z.uuid("Invalid group id"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export type GroupParams = z.infer<typeof groupParamsSchema>;