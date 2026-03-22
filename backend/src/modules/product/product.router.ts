import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} from "./product.controller.js";
import checkAuth from "../../middlewares/checkAuth.js";
import { uploader } from "../../utils/fileUploader.js";
import { parseJsonFields } from "../../utils/parseJsonFields.js";

const productRouter = express.Router();

const imageUploader = uploader(
  ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  5000000,
  "Only .jpg, .jpeg, .png or .webp format allowed",
  10
);

productRouter.post(
  "/v1/create",
  checkAuth,
  imageUploader.array("images", 10),
  parseJsonFields(["attributeValueIds", "categories_id", "keyFeatures", "specifications"]),
  validateSchema(createProductSchema),
  createProduct,
);
productRouter.get("/v1/all", getAllProducts);
productRouter.get("/v1/:id", getProductById);
productRouter.patch(
  "/v1/:id",
  checkAuth,
  imageUploader.array("images", 10),
  parseJsonFields(["attributeValueIds", "categories_id", "keyFeatures", "specifications"]),
  validateSchema(updateProductSchema),
  updateProduct,
);
productRouter.delete("/v1/all", checkAuth, deleteAllProducts);
productRouter.delete("/v1/:id", checkAuth, deleteProduct);

export default productRouter;
