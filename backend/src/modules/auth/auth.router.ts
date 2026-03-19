import express from "express";

import { loginSchema } from "./auth.schema.js";
import { login, logout, getCurrentUser } from "./auth.controller.js";
import validateSchema from "$/middlewares/validateSchema.js";
import checkAuth from "$/middlewares/checkAuth.js";

const authRouter = express.Router();

authRouter.post("/v1/login", validateSchema(loginSchema), login);
authRouter.post("/v1/logout", checkAuth, logout);
authRouter.get("/v1/me", checkAuth, getCurrentUser);

export default authRouter;
