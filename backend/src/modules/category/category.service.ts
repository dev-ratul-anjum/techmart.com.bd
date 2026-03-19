import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { TCreateCategory, TUpdateCategory } from "./category.schema.js";
import { uploadToCloudinary } from "../../utils/fileUploader.js";

const categorySelect = {
  id: true,
  name: true,
  description: true,
  categoryUrl: true,
  image: true,
  metaTagTitle: true,
  metaTagDescription: true,
  metaTagKeywords: true,
};

export const createCategoryService = async (
  payload: TCreateCategory,
  file?: Express.Multer.File
) => {
  const isExist = await prisma.category.findUnique({
    where: { categoryUrl: payload.categoryUrl },
  });

  if (isExist) {
    throw new ApiError(400, "Category already exists with this categoryUrl");
  }

  let imageUrl;

  if (file) {
    const uploadResult = await uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;
  }

  const created = await prisma.category.create({
    data: {
      ...payload,
      image: imageUrl,
    },
    select: categorySelect,
  });

  return created;
};

export const getAllCategoriesService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const total = await prisma.category.count();

  const items = await prisma.category.findMany({
    select: categorySelect,
    skip,
    take: limit,
    orderBy: { name: "asc" },
  });

  const totalPages = Math.ceil(total / limit);

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    items,
    meta: {
      totalMessages: total,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  };
};

export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: categorySelect,
  });

  if (!category) throw new ApiError(404, "Category not found");

  return category;
};

export const updateCategoryService = async (
  id: string,
  payload: TUpdateCategory,
  file?: Express.Multer.File
) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) throw new ApiError(404, "Category not found");

  if (payload.categoryUrl) {
    const urlOwner = await prisma.category.findUnique({
      where: { categoryUrl: payload.categoryUrl },
      select: { id: true },
    });

    if (urlOwner && urlOwner.id !== id) {
      throw new ApiError(400, "Category already exists with this categoryUrl");
    }
  }

  let imageUrl;

  if (file) {
    const uploadResult = await uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;
  }

  const updateData: any = { ...payload };
  if (imageUrl) updateData.image = imageUrl;

  const updated = await prisma.category.update({
    where: { id },
    data: updateData,
    select: categorySelect,
  });

  return updated;
};

export const deleteCategoryService = async (id: string) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) throw new ApiError(404, "Category not found");

  await prisma.category.delete({
    where: { id },
  });
};
