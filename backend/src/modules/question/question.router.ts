import express from "express";
import validateSchema from "../../middlewares/validateSchema.js";
import {
  createQuestionSchema,
  updateQuestionSchema,
} from "./question.schema.js";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "./question.controller.js";
import checkAuth from "../../middlewares/checkAuth.js";

const questionRouter = express.Router();

questionRouter.post(
  "/v1/create",
  checkAuth,
  validateSchema(createQuestionSchema),
  createQuestion,
);
questionRouter.get("/v1/all", getAllQuestions);
questionRouter.get("/v1/:id", getQuestionById);
questionRouter.patch(
  "/v1/:id",
  checkAuth,
  validateSchema(updateQuestionSchema),
  updateQuestion,
);
questionRouter.delete("/v1/:id", checkAuth, deleteQuestion);

export default questionRouter;
