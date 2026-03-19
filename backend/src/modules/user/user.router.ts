import express from "express";

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  console.log("Register User");
});

export default userRouter;
