import { z } from "zod";

export const testSchema = z
  .object({
    name: z.string(),
    bookId: z.number(),
    isPaid: z.boolean().optional(),
  })
  .strict();
