import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createAddressService,
  getAllAddressesService,
  getAddressByIdService,
  updateAddressService,
  deleteAddressService,
} from "./address.service.js";

export const createAddress = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await createAddressService(req.body, userId);

  return responseHandler(res, 201, {
    success: true,
    message: "Address created successfully",
    data: result,
  });
});

export const getAllAddresses = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.user?.id;

    const result = await getAllAddressesService(page, limit, userId);

    return responseHandler(res, 200, {
      success: true,
      message: "Addresses retrieved successfully",
      data: result,
    });
  },
);

export const getAddressById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await getAddressByIdService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Address retrieved successfully",
      data: result,
    });
  },
);

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  const result = await updateAddressService(id, req.body);

  return responseHandler(res, 200, {
    success: true,
    message: "Address updated successfully",
    data: result,
  });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid or missing ID parameter");
  }

  await deleteAddressService(id);

  return responseHandler(res, 200, {
    success: true,
    message: "Address deleted successfully",
  });
});
