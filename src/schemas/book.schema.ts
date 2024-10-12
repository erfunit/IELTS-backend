import { z } from "zod";

export const bookSchema = z
  .object({
    image: z.string().nullable().optional(),
    name: z.string().min(1),
    originalPrice: z.number().min(0),
    discountPercentage: z.number().min(0).max(100).nullable().optional(),
    publisher: z.string().min(1),
  })
  .strict();
