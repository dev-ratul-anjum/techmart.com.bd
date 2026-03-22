import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z.string({ message: "Attribute name is required" }),
  categoryId: z.string({ message: "Category ID is required" }),
});

export const updateAttributeSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
});

export const createAttributeValueSchema = z.object({
  attributeId: z.string({ message: "Attribute ID is required" }),
  value: z.string({ message: "Value is required" }),
});

export const updateAttributeValueSchema = z.object({
  attributeId: z.string().optional(),
  value: z.string().optional(),
});

export type TCreateAttribute = z.infer<typeof createAttributeSchema>;
export type TUpdateAttribute = z.infer<typeof updateAttributeSchema>;
export type TCreateAttributeValue = z.infer<typeof createAttributeValueSchema>;
export type TUpdateAttributeValue = z.infer<typeof updateAttributeValueSchema>;
