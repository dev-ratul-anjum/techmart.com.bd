import express from "express";
import customerRouter from "./modules/user/customer/customer.router.js";
import authRouter from "./modules/auth/auth.router.js";
import categoryRouter from "./modules/category/category.router.js";
import manufacturerRouter from "./modules/manufacturer/manufacturer.router.js";

const appRouter = express.Router();

appRouter.use("/customer", customerRouter);
appRouter.use("/auth", authRouter);
appRouter.use("/category", categoryRouter);
appRouter.use("/manufacturer", manufacturerRouter);

export default appRouter;
