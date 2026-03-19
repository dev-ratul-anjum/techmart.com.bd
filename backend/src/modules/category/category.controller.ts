import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    await createCategoryService(req.body, req.file);

    return responseHandler(res, 201, {
      success: true,
      message: "Category created successfully",
    });
  }
);

export const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const parseQueryInt = (
      value: unknown,
      defaultValue: number,
      maxValue?: number
    ) => {
      const raw =
        typeof value === "string"
          ? value
          : Array.isArray(value)
            ? value[0]
            : undefined;

      const parsed = raw ? Number.parseInt(raw, 10) : NaN;
      if (!Number.isFinite(parsed)) return defaultValue;

      let num = Math.floor(parsed);
      if (num < 1) num = 1;
      if (typeof maxValue === "number" && num > maxValue) num = maxValue;
      return num;
    };

    const page = parseQueryInt(req.query.page, 1);
    const limit = parseQueryInt(req.query.limit, 10, 100);

    const data = await getAllCategoriesService(page, limit);

    return responseHandler(res, 200, {
      success: true,
      message: "Categories retrieved successfully",
      data,
    });
  }
);

export const getCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await getCategoryByIdService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  }
);

export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await updateCategoryService(id, req.body, req.file);

    return responseHandler(res, 200, {
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  }
);

export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    await deleteCategoryService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Category deleted successfully",
    });
  }
);
