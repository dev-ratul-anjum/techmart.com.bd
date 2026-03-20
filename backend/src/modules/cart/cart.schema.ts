import { z } from "zod";

export const manageCartSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
  quantity: z.number().int().min(1).optional(),
});

export type TManageCart = z.infer<typeof manageCartSchema>;
