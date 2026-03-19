import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string("Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: z
    .string("Description is required")
    .min(5, "Description must be at least 5 characters"),
  categoryUrl: z
    .string("Category URL is required")
    .min(2, "Category URL must be at least 2 characters"),
  metaTagTitle: z
    .string("Meta tag title is required")
    .min(1, "Meta tag title is required"),
  metaTagDescription: z
    .string("Meta tag description is required")
    .min(1, "Meta tag description is required"),
  metaTagKeywords: z
    .string("Meta tag keywords are required")
    .min(1, "Meta tag keywords are required"),
});

export const updateCategorySchema = z.object({
  name: z
    .string("Name must be a string")
    .min(2, "Name must be at least 2 characters")
    .optional(),
  description: z
    .string("Description must be a string")
    .min(5, "Description must be at least 5 characters")
    .optional(),
  categoryUrl: z
    .string("Category URL must be a string")
    .min(2, "Category URL must be at least 2 characters")
    .optional(),
  metaTagTitle: z
    .string("Meta tag title must be a string")
    .min(1, "Meta tag title is required")
    .optional(),
  metaTagDescription: z
    .string("Meta tag description must be a string")
    .min(1, "Meta tag description is required")
    .optional(),
  metaTagKeywords: z
    .string("Meta tag keywords must be a string")
    .min(1, "Meta tag keywords are required")
    .optional(),
});

export type TCreateCategory = z.infer<typeof createCategorySchema>;
export type TUpdateCategory = z.infer<typeof updateCategorySchema>;
