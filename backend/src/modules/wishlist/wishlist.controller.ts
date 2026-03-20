import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  manageWishlistService,
  getWishlistItemsService,
  deleteWishlistItemService,
} from "./wishlist.service.js";

export const manageWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await manageWishlistService(req.body, userId);

    return responseHandler(res, 200, {
      success: true,
      message: "Wishlist item processed successfully",
      data: result,
    });
  },
);

export const getWishlistItems = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.id;

    const result = await getWishlistItemsService(userId, page, limit);

    return responseHandler(res, 200, {
      success: true,
      message: "Wishlist items retrieved successfully",
      data: result,
    });
  },
);

export const deleteWishlistItem = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    await deleteWishlistItemService(id, userId);

    return responseHandler(res, 200, {
      success: true,
      message: "Wishlist item deleted successfully",
    });
  },
);
