import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  deleteAllProductsService,
} from "./product.service.js";

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await createProductService(
    req.body,
    req.files as Express.Multer.File[],
  );
  return responseHandler(res, 201, {
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await getAllProductsService(page, limit);
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data,
    });
  },
);

export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await getProductByIdService(id);
    return responseHandler(res, 200, {
      success: true,
      message: "Product retrieved successfully",
      data: result,
    });
  },
);

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await updateProductService(
    id,
    req.body,
    req.files as Express.Multer.File[],
  );
  return responseHandler(res, 200, {
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await deleteProductService(id);
  return responseHandler(res, 200, {
    success: true,
    message: "Product deleted successfully",
  });
});

export const deleteAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    await deleteAllProductsService();
    return responseHandler(res, 200, {
      success: true,
      message: "All products deleted successfully",
    });
  },
);
