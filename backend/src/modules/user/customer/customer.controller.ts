import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync.js";
import responseHandler from "../../../utils/responseHandler.js";
import { ApiError } from "../../../middlewares/errorHandler.js";
import {
  createCustomerService,
  getAllCustomersService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} from "./customer.service.js";

export const createCustomer = catchAsync(
  async (req: Request, res: Response) => {
    await createCustomerService(req.body, req.file);

    return responseHandler(res, 201, {
      success: true,
      message: "Customer created successfully",
    });
  },
);

export const getAllCustomers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllCustomersService();

    return responseHandler(res, 200, {
      success: true,
      message: "Customers retrieved successfully",
      data: result,
    });
  },
);

export const getCustomerById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await getCustomerByIdService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Customer retrieved successfully",
      data: result,
    });
  },
);

export const updateCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await updateCustomerService(id, req.body, req.file);

    return responseHandler(res, 200, {
      success: true,
      message: "Customer updated successfully",
      data: result,
    });
  },
);

export const deleteCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    await deleteCustomerService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Customer deleted successfully",
    });
  },
);
