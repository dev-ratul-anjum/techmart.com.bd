import { z } from "zod";

export const manageWishlistSchema = z.object({
  productId: z.string({ message: "Product ID is required" }),
});

export type TManageWishlist = z.infer<typeof manageWishlistSchema>;
