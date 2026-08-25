import { z } from "zod";

const phoneNumber = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, "must be a valid phone number")
  .transform((value) => value.replace(/\D/g, ""));

export const requestOtpSchema = z.object({
  phoneNumber,
});

export const verifyOtpSchema = z.object({
  phoneNumber,
  otp: z.string().trim().length(6, "otp must be 6 digits"),
  name: z.string().trim().min(1).max(100).optional(),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;