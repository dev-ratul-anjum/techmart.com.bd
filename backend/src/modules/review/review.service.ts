import { prisma } from "../../prisma/prisma.js";
import { TCreateReview, TUpdateReview } from "./review.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

export const createReviewService = async (
  payload: TCreateReview,
  userId: string,
) => {
  return await prisma.review.create({
    data: { ...payload, authorId: userId },
  });
};

export const getAllReviewsService = async (
  page: number = 1,
  limit: number = 10,
  product_id?: string,
) => {
  const skip = (page - 1) * limit;

  const where = product_id ? { product_id } : {};

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true, photo: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    items,
  };
};

export const getReviewByIdService = async (id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, photo: true } },
    },
  });

  if (!review) throw new ApiError(404, "Review not found");

  return review;
};

export const updateReviewService = async (
  id: string,
  payload: TUpdateReview,
) => {
  const existing = await prisma.review.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Review not found");

  return await prisma.review.update({
    where: { id },
    data: payload,
  });
};

export const deleteReviewService = async (id: string) => {
  const existing = await prisma.review.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Review not found");

  await prisma.review.delete({ where: { id } });
};
