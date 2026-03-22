import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import {
  createAttributeSchema,
  updateAttributeSchema,
  createAttributeValueSchema,
  updateAttributeValueSchema,
} from "./attribute.schema.js";
import {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  getAllAttributeValues,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
} from "./attribute.controller.js";

const attributeRouter = express.Router();

// --- Attribute Routes ---
attributeRouter.post(
  "/v1/create",
  validateSchema(createAttributeSchema),
  createAttribute,
);
attributeRouter.get("/v1/all", getAllAttributes);
attributeRouter.get("/v1/:id", getAttributeById);
attributeRouter.patch(
  "/v1/:id",
  validateSchema(updateAttributeSchema),
  updateAttribute,
);
attributeRouter.delete("/v1/:id", deleteAttribute);

// --- Attribute Value Routes ---
attributeRouter.post(
  "/v1/value/create",
  validateSchema(createAttributeValueSchema),
  createAttributeValue,
);
attributeRouter.get("/v1/value/all", getAllAttributeValues);
attributeRouter.get("/v1/value/:id", getAttributeValueById);
attributeRouter.patch(
  "/v1/value/:id",
  validateSchema(updateAttributeValueSchema),
  updateAttributeValue,
);
attributeRouter.delete("/v1/value/:id", deleteAttributeValue);

export default attributeRouter;
