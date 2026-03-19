import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRouter from "./router.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";
import corsOptions from "./utils/corsOptions.js";
import { env } from "./utils/env.js";

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(env.COOKIE_SECRET));

app.use("/api", appRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
