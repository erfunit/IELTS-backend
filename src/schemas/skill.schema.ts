import { z } from "zod";

export const skillSchema = z
  .object({
    testId: z.number().int(),
    skillType: z.enum(["READING", "LISTENING", "WRITING"]),
  })
  .strict();
