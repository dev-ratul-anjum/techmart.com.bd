import { z } from "zod";

const StockStatusEnum = z.enum([
  "IN_STOCK",
  "OUT_OF_STOCK",
  "PRE_ORDER",
  "UPCOMING",
]);

export const createProductSchema = z.object({
  model: z.string({ message: "Model is required" }),
  name: z.string({ message: "Name is required" }),
  description: z.string({ message: "Description is required" }),
  price: z.coerce.number({ message: "Price is required" }).int().positive(),
  discountPrice: z.coerce.number().int().nonnegative().optional(),
  regularPrice: z.coerce.number().int().nonnegative().optional(),
  quantity: z.coerce.number({ message: "Quantity is required" }).int().nonnegative(),
  stockStatus: StockStatusEnum.optional(),
  productUrl: z.string({ message: "Product URL is required" }),
  specifications: z.record(z.string(), z.any()),
  keyFeatures: z.record(z.string(), z.any()),
  images: z.array(z.string()).optional(), // Handled by multipart
  metaTagTitle: z.string({ message: "Meta tag title is required" }),
  metaTagDescription: z.string({ message: "Meta tag description is required" }),
  metaTagKeywords: z.string({ message: "Meta tag keywords are required" }),
  manufacturer_id: z.string({ message: "Manufacturer ID is required" }),
  categories_id: z.array(z.string()).min(1, "At least one category ID is required"),
  attributeValueIds: z.array(z.string()).optional(),
});

export const updateProductSchema = z.object({
  model: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().int().positive().optional(),
  discountPrice: z.coerce.number().int().nonnegative().optional(),
  regularPrice: z.coerce.number().int().nonnegative().optional(),
  quantity: z.coerce.number().int().nonnegative().optional(),
  stockStatus: StockStatusEnum.optional(),
  productUrl: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  keyFeatures: z.record(z.string(), z.any()).optional(),
  images: z.array(z.string()).optional(),
  metaTagTitle: z.string().optional(),
  metaTagDescription: z.string().optional(),
  metaTagKeywords: z.string().optional(),
  manufacturer_id: z.string().optional(),
  categories_id: z.array(z.string()).optional(),
  attributeValueIds: z.array(z.string()).optional(),
});

export type TCreateProduct = z.infer<typeof createProductSchema>;
export type TUpdateProduct = z.infer<typeof updateProductSchema>;
