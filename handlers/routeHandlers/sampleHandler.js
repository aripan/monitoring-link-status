const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const sampleRouter = express.Router();

sampleRouter.get("/", (req, res) => {
  sendResponse(res, 202, {
    message: "This is sample route",
  });
});

sampleRouter.post("/", (req, res) => {
  console.dir(req.body);
  res.send("Hello World!!!");
});

module.exports = sampleRouter;
