import { z } from "zod";

export const createQuestionSchema = z.object({
  product_id: z.string({ message: "Product ID is required" }),
  question: z.string({ message: "Question is required" }),
});

export const updateQuestionSchema = z.object({
  question: z.string().optional(),
  answer: z.string().optional(),
});

export type TCreateQuestion = z.infer<typeof createQuestionSchema>;
export type TUpdateQuestion = z.infer<typeof updateQuestionSchema>;
