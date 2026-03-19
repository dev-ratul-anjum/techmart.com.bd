import { ErrorRequestHandler, RequestHandler } from "express";
import responseHandler from "../utils/responseHandler.js";
import { Prisma } from "../prisma/generated/client.js";
import { ZodError } from "zod";
import {
  parseP2003FieldName,
  parsePrismaValidationError,
} from "../utils/prismaErrorParser.js";

export class ApiError extends Error {
  statusCode: number;
  path: string;
  data: any;

  constructor(
    statusCode: number,
    message: string,
    path: string = "",
    data?: any,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.data = data;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const notFoundHandler: RequestHandler = (req, res, next) => {
  return responseHandler(res, 404, {
    success: false,
    message: "Oops! The page you’re looking for doesn’t exist.",
  });
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong. Please try again later.";
  let errors = null;

  if (!(err instanceof ApiError)) {
    console.log(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint
        statusCode = 409;
        message = "Duplicate value violates a unique constraint";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P2003": // Foreign key
        const modelName = err.meta?.modelName || "UnknownModel";
        const fieldName = parseP2003FieldName(err.message);

        statusCode = 400;
        message = `Invalid value provided for '${fieldName}'. Please ensure the referenced record exists.`;
        errors = [
          {
            path: fieldName !== "unknown_field" ? fieldName : "general",
            message,
          },
        ];
        break;

      case "P1000": // Auth fail
        statusCode = 500;
        message = "Database authentication failed";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P2011": // Null constraint violation
        statusCode = 400;
        message = "Required field is missing or null";
        errors = [
          {
            path: (err.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      default:
        statusCode = 400;
        message = err.message;
        errors = [{ path: "general", message }];
        break;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    const error = parsePrismaValidationError(err.message);
    statusCode = 400;
    message = err.message ?? "Prisma query validation error";
    errors = [
      {
        path: error.field !== "unknown_field" ? error.field : "general",
        message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    message = "Unknown error occurred in Prisma";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = "Prisma client failed to initialize";
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Input validation failed";
    errors = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || "general",
      message: issue.message,
    }));
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.path) {
      errors = [{ path: err.path, message }];
    }
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  return responseHandler(res, statusCode, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
