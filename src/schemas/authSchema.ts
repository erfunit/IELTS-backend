import { z } from "zod";

export const loginSchema = z
  .object({
    phoneNumber: z.string().max(11),
  })
  .strict();

export const verifySchema = z
  .object({
    phoneNumber: z.string().max(11),
    otpCode: z.string().length(6),
  })
  .strict();
