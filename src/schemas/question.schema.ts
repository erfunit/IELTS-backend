import { z } from "zod";

export const questionSchema = z
  .object({
    partId: z.number().int(),
    questionType: z.enum([
      "MULTIPLE_CHOICE",
      "MATCH_HEADING",
      "PARAGRAPH_INFORMATION",
      "TABLE_MATCHING",
      "MULTI_SELECT",
      "FILL_IN_BLANKS_NO_OPTIONS",
      "FILL_IN_BLANKS_WITH_OPTIONS",
      "TRUE_FALSE_NOT_GIVEN",
      "MATCHING_ITEMS",
    ]),
    questionText: z.string().min(1),
    options: z.array(z.string()).optional(),
    correctAnswers: z.union([z.array(z.string()), z.string()]).optional(),
    matchingPairs: z
      .array(z.object({ key: z.string(), value: z.string() }))
      .optional(),
    userAnswer: z.union([z.array(z.string()), z.string()]).optional(),
  })
  .strict();
