import { z } from "zod";

export const searchUsersSchema = z.object({
  phoneNumbers: z
    .array(
      z
        .string()
        .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    )
    .min(1, "At least one phone number is required")
    .max(500, "Too many phone numbers"),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;

