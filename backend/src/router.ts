import express from "express";
import customerRouter from "./modules/user/customer/customer.router.js";
import authRouter from "./modules/auth/auth.router.js";

const appRouter = express.Router();

appRouter.use("/customer", customerRouter);
appRouter.use("/auth", authRouter);

export default appRouter;
