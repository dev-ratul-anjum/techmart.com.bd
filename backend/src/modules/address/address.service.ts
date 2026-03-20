import { prisma } from "../../prisma/prisma.js";
import { TCreateAddress, TUpdateAddress } from "./address.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

export const createAddressService = async (
  payload: TCreateAddress,
  userId: string,
) => {
  // If new address is marked as default, unset other defaults
  if (payload.markAsDefault) {
    await prisma.address.updateMany({
      where: { userId: userId, markAsDefault: true },
      data: { markAsDefault: false },
    });
  }

  return await prisma.address.create({
    data: {
      ...payload,
      markAsDefault: payload.markAsDefault ?? false,
      userId: userId,
    },
  });
};

export const getAllAddressesService = async (
  page: number = 1,
  limit: number = 10,
  userId: string,
) => {
  const skip = (page - 1) * limit;

  const where = { userId };

  const [items, total] = await Promise.all([
    prisma.address.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.address.count({ where }),
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

export const getAddressByIdService = async (id: string) => {
  const address = await prisma.address.findUnique({
    where: { id },
  });

  if (!address) throw new ApiError(404, "Address not found");

  return address;
};

export const updateAddressService = async (
  id: string,
  payload: TUpdateAddress,
) => {
  const existing = await prisma.address.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Address not found");

  if (payload.markAsDefault) {
    await prisma.address.updateMany({
      where: { userId: existing.userId, markAsDefault: true },
      data: { markAsDefault: false },
    });
  }

  return await prisma.address.update({
    where: { id },
    data: payload,
  });
};

export const deleteAddressService = async (id: string) => {
  const existing = await prisma.address.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Address not found");

  await prisma.address.delete({ where: { id } });
};
