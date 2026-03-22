import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createAttributeService,
  getAllAttributesService,
  getAttributeByIdService,
  updateAttributeService,
  deleteAttributeService,
  createAttributeValueService,
  getAllAttributeValuesService,
  getAttributeValueByIdService,
  updateAttributeValueService,
  deleteAttributeValueService,
} from "./attribute.service.js";

// -- Attribute --
export const createAttribute = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createAttributeService(req.body);
    return responseHandler(res, 201, {
      success: true,
      message: "Attribute created successfully",
      data: result,
    });
  },
);

export const getAllAttributes = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await getAllAttributesService(page, limit);
    // Response handler sends data field, but to match exactly the required structure, we can send it dynamically manually, or attach it inside data:
    res.status(200).json({
      success: true,
      message: "Attributes retrieved successfully",
      ...result,
    });
  },
);

export const getAttributeById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await getAttributeByIdService(id);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute retrieved successfully",
      data: result,
    });
  },
);

export const updateAttribute = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await updateAttributeService(id, req.body);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute updated successfully",
      data: result,
    });
  },
);

export const deleteAttribute = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await deleteAttributeService(id);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute deleted successfully",
    });
  },
);

// -- Attribute Value --
export const createAttributeValue = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createAttributeValueService(req.body);
    return responseHandler(res, 201, {
      success: true,
      message: "Attribute value created successfully",
      data: result,
    });
  },
);

export const getAllAttributeValues = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const attributeId = req.query.attributeId as string | undefined;

    const result = await getAllAttributeValuesService(page, limit, attributeId);
    res.status(200).json({
      success: true,
      message: "Attribute values retrieved successfully",
      ...result,
    });
  },
);

export const getAttributeValueById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await getAttributeValueByIdService(id);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute value retrieved successfully",
      data: result,
    });
  },
);

export const updateAttributeValue = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await updateAttributeValueService(id, req.body);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute value updated successfully",
      data: result,
    });
  },
);

export const deleteAttributeValue = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await deleteAttributeValueService(id);
    return responseHandler(res, 200, {
      success: true,
      message: "Attribute value deleted successfully",
    });
  },
);
