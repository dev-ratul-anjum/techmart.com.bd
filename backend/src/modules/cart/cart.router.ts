import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { manageCartSchema } from "./cart.schema.js";
import { manageCart, getCartItems, deleteCartItem } from "./cart.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";

const cartRouter = express.Router();

// The prompt specifies to implement 3 routes: Create, Update, Get all
// Since Create and Update share exactly the same logic as defined by the user constraints,
// We map both routes to the same controller function `manageCart` to satisfy the requested 3 routes.
cartRouter.post("/v1/create", checkAuth, validateSchema(manageCartSchema), manageCart);
cartRouter.patch("/v1/update", checkAuth, validateSchema(manageCartSchema), manageCart);

// Get all items for a specific user (pagination required)
// Passed via query e.g. /v1/all?userId=XYZ&page=1&limit=10
cartRouter.get("/v1/all", checkAuth, getCartItems);

cartRouter.delete("/v1/:id", checkAuth, deleteCartItem);

export default cartRouter;
