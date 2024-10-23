import { z } from "zod";

export const userSchema = z
  .object({
    phoneNumber: z.string(),
    role: z.enum(["ADMIN", "USER"]),
  })
  .strict();
