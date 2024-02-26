const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const { checkMethod } = require("../../middleware/checkMethod");
const userRouter = express.Router();

// Middleware to restrict HTTP methods
const restrictMethods = (req, res, next) => {
  const error = checkMethod(req.method);
  if (error) {
    return sendResponse(res, 405, error);
  }
  next();
};

userRouter.use(restrictMethods);

userRouter.get("/", (req, res) => {
  sendResponse(res, 202, {
    message: "This is user route",
  });
});

userRouter.post("/", (req, res) => {
  console.dir(req.body);
  res.send("Hello World!!!");
});

module.exports = userRouter;
