import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import {
  TCreateManufacturer,
  TUpdateManufacturer,
} from "./manufacturer.schema.js";
import { uploadToCloudinary } from "../../utils/fileUploader.js";

const manufacturerSelect = {
  id: true,
  name: true,
  image: true,
  description: true,
  manufacturerUrl: true,
  metaTagTitle: true,
  metaTagDescription: true,
  metaTagKeywords: true,
};

export const createManufacturerService = async (
  payload: TCreateManufacturer,
  file?: Express.Multer.File
) => {
  const isExist = await prisma.manufacturer.findUnique({
    where: { manufacturerUrl: payload.manufacturerUrl },
  });

  if (isExist) {
    throw new ApiError(
      400,
      "Manufacturer already exists with this manufacturerUrl"
    );
  }

  let imageUrl;

  if (file) {
    const uploadResult = await uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;
  }

  const created = await prisma.manufacturer.create({
    data: {
      ...payload,
      image: imageUrl,
    },
    select: manufacturerSelect,
  });

  return created;
};

export const getAllManufacturersService = async (
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const total = await prisma.manufacturer.count();

  const items = await prisma.manufacturer.findMany({
    select: manufacturerSelect,
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

export const getManufacturerByIdService = async (id: string) => {
  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id },
    select: manufacturerSelect,
  });

  if (!manufacturer) throw new ApiError(404, "Manufacturer not found");

  return manufacturer;
};

export const updateManufacturerService = async (
  id: string,
  payload: TUpdateManufacturer,
  file?: Express.Multer.File
) => {
  const existing = await prisma.manufacturer.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) throw new ApiError(404, "Manufacturer not found");

  if (payload.manufacturerUrl) {
    const urlOwner = await prisma.manufacturer.findUnique({
      where: { manufacturerUrl: payload.manufacturerUrl },
      select: { id: true },
    });

    if (urlOwner && urlOwner.id !== id) {
      throw new ApiError(
        400,
        "Manufacturer already exists with this manufacturerUrl"
      );
    }
  }

  let imageUrl;

  if (file) {
    const uploadResult = await uploadToCloudinary(file);
    imageUrl = uploadResult.secure_url;
  }

  const updateData: any = { ...payload };
  if (imageUrl) updateData.image = imageUrl;

  const updated = await prisma.manufacturer.update({
    where: { id },
    data: updateData,
    select: manufacturerSelect,
  });

  return updated;
};

export const deleteManufacturerService = async (id: string) => {
  const existing = await prisma.manufacturer.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) throw new ApiError(404, "Manufacturer not found");

  await prisma.manufacturer.delete({ where: { id } });
};
