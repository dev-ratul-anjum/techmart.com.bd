import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createReviewService,
  getAllReviewsService,
  getReviewByIdService,
  updateReviewService,
  deleteReviewService,
} from "./review.service.js";

export const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await createReviewService(req.body, userId);

  return responseHandler(res, 201, {
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const product_id = req.query.product_id as string | undefined;

  const result = await getAllReviewsService(page, limit, product_id);

  return responseHandler(res, 200, {
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

export const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  const result = await getReviewByIdService(id);

  return responseHandler(res, 200, {
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  const result = await updateReviewService(id, req.body);

  return responseHandler(res, 200, {
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  await deleteReviewService(id);

  return responseHandler(res, 200, {
    success: true,
    message: "Review deleted successfully",
  });
});
