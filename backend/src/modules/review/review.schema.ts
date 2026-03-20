import { z } from "zod";

// We emulate the enum manually since relying on @prisma/client might cause uncompiled type checking issues
const ReviewStatus = z.enum(["DISABLED", "INABLED"]);

export const createReviewSchema = z.object({
  product_id: z.string({ message: "Product ID is required" }),
  text: z.string({ message: "Review text is required" }),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  status: ReviewStatus.optional(),
});

export const updateReviewSchema = z.object({
  text: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  status: ReviewStatus.optional(),
});

export type TCreateReview = z.infer<typeof createReviewSchema>;
export type TUpdateReview = z.infer<typeof updateReviewSchema>;
