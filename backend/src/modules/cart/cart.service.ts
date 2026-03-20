import { prisma } from "../../prisma/prisma.js";
import { TManageCart } from "./cart.schema.js";
import { ApiError } from "../../middlewares/errorHandler.js";

// Handles both Create and Update logic as per requirements
export const manageCartService = async (payload: TManageCart, userId: string) => {
  const { productId } = payload;
  const quantity = payload.quantity ?? 1;

  return await prisma.$transaction(async (tx) => {
    // 1. Check if a cart item already exists for the given user + productId
    const existingCartItem = await tx.cartItem.findFirst({
      where: {
        productId,
        cart: {
          userId,
        },
      },
    });

    if (existingCartItem) {
      // If it exists -> update the quantity
      return await tx.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity },
      });
    }

    // If not: Check if the user already has a cart
    let cart = await tx.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      // If no -> first create the cart
      cart = await tx.cart.create({
        data: { userId },
      });
    }

    // then create the item
    return await tx.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  });
};

export const getCartItemsService = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
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

  const where = { cartId: cart.id };

  const [items, total] = await Promise.all([
    prisma.cartItem.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: true,
      },
      orderBy: { id: "desc" },
    }),
    prisma.cartItem.count({ where }),
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

export const deleteCartItemService = async (id: string, userId: string) => {
  const existing = await prisma.cartItem.findUnique({
    where: { id },
    include: { cart: true },
  });

  if (!existing) throw new ApiError(404, "Cart item not found");
  if (existing.cart.userId !== userId) throw new ApiError(403, "Not authorized to delete this cart item");

  await prisma.cartItem.delete({ where: { id } });
};
