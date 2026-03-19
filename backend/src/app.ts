import express from "express";
import cors from "cors";
import appRouter from "./router.js";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.js";
import corsOptions from "./utils/corsOptions.js";

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api", appRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
