import { prisma } from "../../prisma/prisma.js";
import { TManageWishlist } from "./wishlist.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

// Handles Create (and technically Update through idempotent logic for Wishlist)
export const manageWishlistService = async (payload: TManageWishlist, userId: string) => {
  const { productId } = payload;

  return await prisma.$transaction(async (tx) => {
    // 1. Check if item already exists for given user + productId
    const existingWishlistItem = await tx.wishlistItem.findFirst({
      where: {
        productId,
        wishlist: {
          userId,
        },
      },
    });

    if (existingWishlistItem) {
      // Wishlist items have no quantity to update; just return existing
      return existingWishlistItem;
    }

    // Check if user has a wishlist
    let wishlist = await tx.wishlist.findUnique({
      where: { userId },
    });

    if (!wishlist) {
      // If no -> create wishlist explicitly
      wishlist = await tx.wishlist.create({
        data: { userId },
      });
    }

    // Create the item
    return await tx.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });
  });
};

export const getWishlistItemsService = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
  });

  if (!wishlist) {
    return {
      meta: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
      items: [],
    };
  }

  const where = { wishlistId: wishlist.id };

  const [items, total] = await Promise.all([
    prisma.wishlistItem.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: true,
      },
      orderBy: { id: "desc" },
    }),
    prisma.wishlistItem.count({ where }),
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

export const deleteWishlistItemService = async (id: string, userId: string) => {
  const existing = await prisma.wishlistItem.findUnique({
    where: { id },
    include: { wishlist: true },
  });

  if (!existing) throw new ApiError(404, "Wishlist item not found");
  if (existing.wishlist.userId !== userId) throw new ApiError(403, "Not authorized to delete this wishlist item");

  await prisma.wishlistItem.delete({ where: { id } });
};
