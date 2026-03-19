import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createManufacturerService,
  getAllManufacturersService,
  getManufacturerByIdService,
  updateManufacturerService,
  deleteManufacturerService,
} from "./manufacturer.service.js";

export const createManufacturer = catchAsync(
  async (req: Request, res: Response) => {
    await createManufacturerService(req.body, req.file);

    return responseHandler(res, 201, {
      success: true,
      message: "Manufacturer created successfully",
    });
  }
);

export const getAllManufacturers = catchAsync(
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

    const data = await getAllManufacturersService(page, limit);

    return responseHandler(res, 200, {
      success: true,
      message: "Manufacturers retrieved successfully",
      data,
    });
  }
);

export const getManufacturerById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await getManufacturerByIdService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Manufacturer retrieved successfully",
      data: result,
    });
  }
);

export const updateManufacturer = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await updateManufacturerService(id, req.body, req.file);

    return responseHandler(res, 200, {
      success: true,
      message: "Manufacturer updated successfully",
      data: result,
    });
  }
);

export const deleteManufacturer = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    await deleteManufacturerService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Manufacturer deleted successfully",
    });
  }
);
