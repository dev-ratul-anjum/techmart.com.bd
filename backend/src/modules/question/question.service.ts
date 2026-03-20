import { prisma } from "../../prisma/prisma.js";
import { TCreateQuestion, TUpdateQuestion } from "./question.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

export const createQuestionService = async (
  payload: TCreateQuestion & { askedById: string },
) => {
  return await prisma.question.create({
    data: payload,
  });
};

export const getAllQuestionsService = async (
  page: number = 1,
  limit: number = 10,
  product_id?: string,
) => {
  const skip = (page - 1) * limit;

  const where = product_id ? { product_id } : {};

  const [items, total] = await Promise.all([
    prisma.question.findMany({
      where,
      skip,
      take: limit,
      include: {
        askedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    items,
  };
};

export const getQuestionByIdService = async (id: string) => {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      askedBy: { select: { id: true, name: true } },
    },
  });

  if (!question) throw new ApiError(404, "Question not found");

  return question;
};

export const updateQuestionService = async (
  id: string,
  payload: TUpdateQuestion,
) => {
  const existing = await prisma.question.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Question not found");

  return await prisma.question.update({
    where: { id },
    data: payload,
  });
};

export const deleteQuestionService = async (id: string) => {
  const existing = await prisma.question.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Question not found");

  await prisma.question.delete({ where: { id } });
};
