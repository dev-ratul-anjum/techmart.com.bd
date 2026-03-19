import express from "express";
import { uploader } from "../../../utils/fileUploader.js";
import validateSchema from "../../../middlewares/validateSchema.js";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.schema.js";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "./customer.controller.js";

const customerRouter = express.Router();

const imageUploader = uploader(
  ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  5000000,
  "Only .jpg, .jpeg, .png or .webp format allowed",
);

customerRouter.post(
  "/v1/register",
  imageUploader.single("photo"),
  validateSchema(createCustomerSchema),
  createCustomer,
);
customerRouter.get("/v1/all", getAllCustomers);
customerRouter.get("/v1/:id", getCustomerById);
customerRouter.patch(
  "/v1/:id",
  imageUploader.single("photo"),
  validateSchema(updateCustomerSchema),
  updateCustomer,
);
customerRouter.delete("/v1/:id", deleteCustomer);

export default customerRouter;
