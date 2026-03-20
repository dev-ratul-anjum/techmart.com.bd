import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { manageWishlistSchema } from "./wishlist.schema.js";
import { manageWishlist, getWishlistItems, deleteWishlistItem } from "./wishlist.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";

const wishlistRouter = express.Router();

// Defined 3 routes per instructions: Create, Update, Get all
wishlistRouter.post("/v1/create", checkAuth, validateSchema(manageWishlistSchema), manageWishlist);
wishlistRouter.patch("/v1/update", checkAuth, validateSchema(manageWishlistSchema), manageWishlist);

// Get all items for a specific user (pagination required)
wishlistRouter.get("/v1/all", checkAuth, getWishlistItems);

wishlistRouter.delete("/v1/:id", checkAuth, deleteWishlistItem);

export default wishlistRouter;
