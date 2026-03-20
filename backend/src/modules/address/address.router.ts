import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} from "./address.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";

const addressRouter = express.Router();

addressRouter.post(
  "/v1/create",
  checkAuth,
  validateSchema(createAddressSchema),
  createAddress,
);
addressRouter.get("/v1/all", checkAuth, getAllAddresses);
addressRouter.get("/v1/:id", checkAuth, getAddressById);
addressRouter.patch(
  "/v1/:id",
  checkAuth,
  validateSchema(updateAddressSchema),
  updateAddress,
);
addressRouter.delete("/v1/:id", checkAuth, deleteAddress);

export default addressRouter;
