import { prisma } from "../../prisma/prisma.js";
import {
  TCreateAttribute,
  TUpdateAttribute,
  TCreateAttributeValue,
  TUpdateAttributeValue,
} from "./attribute.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

// -- Attribute Services --

export const createAttributeService = async (payload: TCreateAttribute) => {

  return await prisma.attribute.create({
    data: payload,
  });
};

export const getAllAttributesService = async (
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.attribute.findMany({
      skip,
      take: limit,
      include: {
        category: true,
        values: true,
      },
      orderBy: { id: "desc" },
    }),
    prisma.attribute.count(),
  ]);

  const hasNextPage = skip + limit < total;
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

export const getAttributeByIdService = async (id: string) => {
  const attribute = await prisma.attribute.findUnique({
    where: { id },
    include: {
      category: true,
      values: true,
    },
  });

  if (!attribute) throw new ApiError(404, "Attribute not found");
  return attribute;
};

export const updateAttributeService = async (
  id: string,
  payload: TUpdateAttribute,
) => {

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId },
    });
    if (!category) throw new ApiError(404, "Category not found");
  }

  return await prisma.attribute.update({
    where: { id },
    data: payload,
  });
};

export const deleteAttributeService = async (id: string) => {

  await prisma.attribute.delete({ where: { id } });
};

// -- Attribute Value Services --

export const createAttributeValueService = async (
  payload: TCreateAttributeValue,
) => {

  const existing = await prisma.attributeValue.findUnique({
    where: {
      attributeId_value: {
        attributeId: payload.attributeId,
        value: payload.value,
      },
    },
  });

  if (existing) throw new ApiError(400, "This attribute value already exists");

  return await prisma.attributeValue.create({
    data: payload,
  });
};

export const getAllAttributeValuesService = async (
  page: number = 1,
  limit: number = 10,
  attributeId?: string,
) => {
  const skip = (page - 1) * limit;

  const where = attributeId ? { attributeId } : {};

  const [items, total] = await Promise.all([
    prisma.attributeValue.findMany({
      where,
      skip,
      take: limit,
      include: {
        attribute: true,
      },
      orderBy: { id: "desc" },
    }),
    prisma.attributeValue.count({ where }),
  ]);

  const hasNextPage = skip + limit < total;
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

export const getAttributeValueByIdService = async (id: string) => {
  const attributeValue = await prisma.attributeValue.findUnique({
    where: { id },
    include: {
      attribute: true,
    },
  });

  if (!attributeValue) throw new ApiError(404, "Attribute Value not found");
  return attributeValue;
};

export const updateAttributeValueService = async (
  id: string,
  payload: TUpdateAttributeValue,
) => {

  return await prisma.attributeValue.update({
    where: { id },
    data: payload,
  });
};

export const deleteAttributeValueService = async (id: string) => {

  await prisma.attributeValue.delete({ where: { id } });
};
