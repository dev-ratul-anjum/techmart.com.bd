import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import responseHandler from "../../utils/responseHandler.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  createQuestionService,
  getAllQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService,
} from "./question.service.js";

export const createQuestion = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createQuestionService({
      ...req.body,
      askedById: req.user?.id,
    });

    return responseHandler(res, 201, {
      success: true,
      message: "Question created successfully",
      data: result,
    });
  },
);

export const getAllQuestions = catchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const product_id = req.query.product_id as string | undefined;

    const result = await getAllQuestionsService(page, limit, product_id);

    return responseHandler(res, 200, {
      success: true,
      message: "Questions retrieved successfully",
      data: result,
    });
  },
);

export const getQuestionById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await getQuestionByIdService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Question retrieved successfully",
      data: result,
    });
  },
);

export const updateQuestion = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    const result = await updateQuestionService(id, req.body);

    return responseHandler(res, 200, {
      success: true,
      message: "Question updated successfully",
      data: result,
    });
  },
);

export const deleteQuestion = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new ApiError(400, "Invalid or missing ID parameter");
    }

    await deleteQuestionService(id);

    return responseHandler(res, 200, {
      success: true,
      message: "Question deleted successfully",
    });
  },
);
