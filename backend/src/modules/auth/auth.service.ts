import bcrypt from "bcryptjs";
import { prisma } from "$/prisma/prisma.js";
import { TLogin } from "./auth.schema.js";
import { ApiError } from "$/middlewares/errorHandler.js";
import { createJwtToken } from "$/utils/authHelpers.js";

export const loginService = async (payload: TLogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = createJwtToken(user.id);

  return { token };
};

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      photo: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
