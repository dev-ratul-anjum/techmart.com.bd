import { prisma } from "../../prisma/prisma.js";
import { TCreateProduct, TUpdateProduct } from "./product.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";
import { uploadMultipleToCloudinary } from "../../utils/fileUploader.js";

export const createProductService = async (payload: TCreateProduct, files?: Express.Multer.File[]) => {
  const { attributeValueIds, categories_id, ...productData } = payload;

  const existingProductUrl = await prisma.product.findUnique({
    where: { productUrl: productData.productUrl },
  });
  if (existingProductUrl)
    throw new ApiError(400, "Product with this URL already exists");

  const manufacturer = await prisma.manufacturer.findUnique({
    where: { id: productData.manufacturer_id },
  });
  if (!manufacturer) throw new ApiError(404, "Manufacturer not found");

  let imageUrls: string[] = [];
  if (files && files.length > 0) {
    const uploadResults = await uploadMultipleToCloudinary(files);
    imageUrls = uploadResults.map((result: any) => result.secure_url);
  }

  if (imageUrls.length > 0) {
    productData.images = imageUrls;
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Create Product
    const product = await tx.product.create({
      data: productData,
    });

    // 2. Map Product Values (ProductAttributeValue)
    if (attributeValueIds && Array.isArray(attributeValueIds) && attributeValueIds.length > 0) {
      const attributeValueData = attributeValueIds.map((valId: string) => ({
        productId: product.id,
        attributeValueId: valId,
      }));

      await tx.productAttributeValue.createMany({
        data: attributeValueData,
      });
    }

    // 3. Map Categories (ProductCategory)
    if (categories_id && Array.isArray(categories_id) && categories_id.length > 0) {
      const categoryData = categories_id.map((catId: string) => ({
        productId: product.id,
        categoryId: catId,
      }));

      await tx.productCategory.createMany({
        data: categoryData,
      });
    }

    return product;
  });
};

export const getAllProductsService = async (
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      include: {
        manufacturer: true,
        categories: {
          include: { category: true },
        },
        attributeValues: {
          include: {
            attributeValue: {
              include: { attribute: true },
            },
          },
        },
      },
      orderBy: { id: "desc" },
    }),
    prisma.product.count(),
  ]);

  const hasNextPage = skip + limit < total;
  const hasPrevPage = page > 1;

  return {
    items,
    meta: {
      totalProducts: total,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  };
};

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      manufacturer: true,
      categories: {
        include: { category: true },
      },
      attributeValues: {
        include: {
          attributeValue: {
            include: { attribute: true },
          },
        },
      },
      reviews: true,
      questions: true,
    },
  });

  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const updateProductService = async (
  id: string,
  payload: TUpdateProduct,
  files?: Express.Multer.File[]
) => {
  const existing = await prisma.product.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Product not found");

  const { attributeValueIds, categories_id, ...productData } = payload;

  if (
    productData.productUrl &&
    productData.productUrl !== existing.productUrl
  ) {
    const checkUrl = await prisma.product.findUnique({
      where: { productUrl: productData.productUrl },
    });
    if (checkUrl)
      throw new ApiError(400, "Product with this URL already exists");
  }

  let imageUrls: string[] = [];
  if (files && files.length > 0) {
    const uploadResults = await uploadMultipleToCloudinary(files);
    imageUrls = uploadResults.map((result: any) => result.secure_url);
  }

  if (imageUrls.length > 0) {
    productData.images = imageUrls;
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Update Product
    const product = await tx.product.update({
      where: { id },
      data: productData as any,
    });

    // 2. Update Product Values if array is provided
    if (attributeValueIds && Array.isArray(attributeValueIds)) {
      // Clear mappings
      await tx.productAttributeValue.deleteMany({
        where: { productId: id },
      });

      // Insert mappings
      if (attributeValueIds.length > 0) {
        const attributeValueData = attributeValueIds.map((valId: string) => ({
          productId: id,
          attributeValueId: valId,
        }));
        await tx.productAttributeValue.createMany({
          data: attributeValueData,
        });
      }
    }

    // 3. Update Categories if array is provided
    if (categories_id && Array.isArray(categories_id)) {
      await tx.productCategory.deleteMany({
        where: { productId: id },
      });

      if (categories_id.length > 0) {
        const categoryData = categories_id.map((catId: string) => ({
          productId: id,
          categoryId: catId,
        }));
        await tx.productCategory.createMany({
          data: categoryData,
        });
      }
    }

    return product;
  });
};

export const deleteProductService = async (id: string) => {
  const existing = await prisma.product.findUnique({
    where: { id },
  });
  if (!existing) throw new ApiError(404, "Product not found");

  await prisma.$transaction(async (tx) => {
    await tx.productCategory.deleteMany({
      where: { productId: id },
    });
    await tx.productAttributeValue.deleteMany({
      where: { productId: id },
    });
    await tx.product.delete({
      where: { id },
    });
  });
};

export const deleteAllProductsService = async () => {
  await prisma.$transaction(async (tx) => {
    await tx.productCategory.deleteMany({});
    await tx.productAttributeValue.deleteMany({});
    await tx.product.deleteMany({});
  });
};
