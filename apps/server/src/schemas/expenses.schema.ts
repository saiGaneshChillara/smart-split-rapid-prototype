import { z } from "zod";

const descriptionSchema = z.string().trim().nonempty("Description is required");

const contributorSchema = z.object({
  userId: z.uuid("Invalid user id"),
  amount: z.number().positive(),
});

const participantSchema = z.object({
  userId: z.uuid("Invalid user id"),
  amount: z.number().positive().optional(),
  percentage: z
    .number()
    .min(1, "Percentage should be atleast 1")
    .max(100, "Percentage should be maximum 100")
    .optional(),
})
.refine(
  (data) => !(data.amount !== undefined && data.percentage !== undefined),
  "Cannot provide both amount and percentage",
);

const splitTypeSchema = z.enum([
  "EQUAL",
  "PERCENTAGE",
  "EXACT",
]);

const expenseItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
  amount: z.number().positive("Item amount must be positive"),
  participants: z
    .array(
      participantSchema,
    ).min(1, "Atleast 1 participant should be present"),
  splitType: splitTypeSchema,
})
.refine(
  (data) => new Set(data.participants.map((p) => p.userId)).size === data.participants.length,
  "Duplicate participants are not allowed",
);


export const createExpenseSchema = z.object({
  description: descriptionSchema,
  contributors: z.array(contributorSchema).min(1, "Atleast 1 contributor should be present"),
  expenseItems: z.array(expenseItemSchema).min(1, "Atleast 1 item should be present"),
})
.refine(
  (data) => new Set(data.contributors.map((c) => c.userId)).size === data.contributors.length,
  "Duplicate contributors are not allowed",
);

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;