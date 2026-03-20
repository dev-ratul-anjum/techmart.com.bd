import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { manageCartService, getCartItemsService, deleteCartItemService } from "./cart.service.js";

// We use manageCart for both create and update operations based on business logic requirements
export const manageCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await manageCartService(req.body, userId);

  return responseHandler(res, 200, {
    success: true,
    message: "Cart item processed successfully",
    data: result,
  });
});

export const getCartItems = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const userId = req.user?.id;

  const result = await getCartItemsService(userId, page, limit);

  return responseHandler(res, 200, {
    success: true,
    message: "Cart items retrieved successfully",
    data: result,
  });
});

export const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  await deleteCartItemService(id, userId);

  return responseHandler(res, 200, {
    success: true,
    message: "Cart item deleted successfully",
  });
});
