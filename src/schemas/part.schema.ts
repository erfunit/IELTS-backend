import { z } from "zod";

export const partSchema = z
  .object({
    skillId: z.number().int(),
    passageOrPrompt: z.string().nullable().optional(),
    audioUrl: z.string().nullable().optional(),
  })
  .strict();
