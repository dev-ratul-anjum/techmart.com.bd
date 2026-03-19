import express from "express";

import validateSchema from "../../middlewares/validateSchema.js";
import { uploader } from "../../utils/fileUploader.js";
import {
  createManufacturerSchema,
  updateManufacturerSchema,
} from "./manufacturer.schema.js";
import {
  createManufacturer,
  getAllManufacturers,
  getManufacturerById,
  updateManufacturer,
  deleteManufacturer,
} from "./manufacturer.controller.js";

const manufacturerRouter = express.Router();

const imageUploader = uploader(
  ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  5000000,
  "Only .jpg, .jpeg, .png or .webp format allowed",
);

manufacturerRouter.post(
  "/v1/create",
  imageUploader.single("image"),
  validateSchema(createManufacturerSchema),
  createManufacturer,
);
manufacturerRouter.get("/v1/all", getAllManufacturers);
manufacturerRouter.get("/v1/:id", getManufacturerById);
manufacturerRouter.patch(
  "/v1/:id",
  imageUploader.single("image"),
  validateSchema(updateManufacturerSchema),
  updateManufacturer,
);
manufacturerRouter.delete("/v1/:id", deleteManufacturer);

export default manufacturerRouter;

