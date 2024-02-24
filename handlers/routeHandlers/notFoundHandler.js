const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const notFoundRouter = express.Router();

notFoundRouter.get("/", (req, res) => {
  sendResponse(res, 404, {
    message: "Your requested url is not found",
  });
});

module.exports = notFoundRouter;
