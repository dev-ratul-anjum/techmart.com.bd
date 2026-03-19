import express from "express";

import validateSchema from "../../middlewares/validateSchema.js";
import { uploader } from "../../utils/fileUploader.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

const categoryRouter = express.Router();

const imageUploader = uploader(
  ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  5000000,
  "Only .jpg, .jpeg, .png or .webp format allowed",
);

categoryRouter.post(
  "/v1/create",
  imageUploader.single("image"),
  validateSchema(createCategorySchema),
  createCategory,
);
categoryRouter.get("/v1/all", getAllCategories);
categoryRouter.get("/v1/:id", getCategoryById);
categoryRouter.patch(
  "/v1/:id",
  imageUploader.single("image"),
  validateSchema(updateCategorySchema),
  updateCategory,
);
categoryRouter.delete("/v1/:id", deleteCategory);

export default categoryRouter;

