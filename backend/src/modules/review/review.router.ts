import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import { createReviewSchema, updateReviewSchema } from "./review.schema.js";
import {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "./review.controller.js";
import checkAuth from "$/middlewares/checkAuth.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/v1/create",
  checkAuth,
  validateSchema(createReviewSchema),
  createReview,
);

// Get product reviews
reviewRouter.get("/v1/all", getAllReviews);

// Get single review
reviewRouter.get("/v1/:id", getReviewById);

// Update review
reviewRouter.patch(
  "/v1/:id",
  checkAuth,
  validateSchema(updateReviewSchema),
  updateReview,
);

// Delete review
reviewRouter.delete("/v1/:id", checkAuth, deleteReview);

export default reviewRouter;
