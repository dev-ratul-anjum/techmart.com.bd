import { Request, Response } from "express";
import catchAsync from "$/utils/catchAsync.js";
import responseHandler from "$/utils/responseHandler.js";
import { setAuthCookie, clearAuthCookie } from "$/utils/authHelpers.js";
import { loginService, getCurrentUserService } from "./auth.service.js";

export const login = catchAsync(async (req: Request, res: Response) => {
  const { token } = await loginService(req.body);

  // Set auth cookie
  setAuthCookie(res, token);

  return responseHandler(res, 200, {
    success: true,
    message: "Logged in successfully",
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  clearAuthCookie(res);

  return responseHandler(res, 200, {
    success: true,
    message: "Logged out successfully",
  });
});

export const getCurrentUser = catchAsync(
  async (req: Request, res: Response) => {
    // req.user is guaranteed to be set by checkAuth middleware
    const result = await getCurrentUserService(req.user!.id);

    return responseHandler(res, 200, {
      success: true,
      message: "User retrieved successfully",
      data: result,
    });
  },
);
