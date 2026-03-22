import express from "express";
import customerRouter from "./modules/user/customer/customer.router.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import manufacturerRouter from "./modules/manufacturer/manufacturer.router.js";
import addressRouter from "./modules/address/address.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import wishlistRouter from "./modules/wishlist/wishlist.router.js";
import questionRouter from "./modules/question/question.router.js";
import reviewRouter from "./modules/review/review.router.js";
import attributeRouter from "./modules/attribute/attribute.router.js";
import productRouter from "./modules/product/product.router.js";

const appRouter = express.Router();

appRouter.use("/customer", customerRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/category", categoryRouter);
appRouter.use("/manufacturer", manufacturerRouter);
appRouter.use("/address", addressRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/wishlist", wishlistRouter);
appRouter.use("/question", questionRouter);
appRouter.use("/review", reviewRouter);
appRouter.use("/attribute", attributeRouter);
appRouter.use("/product", productRouter);

export default appRouter;
