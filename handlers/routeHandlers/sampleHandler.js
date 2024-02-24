const express = require("express");
const sampleRouter = express.Router();

sampleRouter.get("/", (req, res) => {
  console.dir(req.query);
  res.send("Sample Route");
});

sampleRouter.post("/", (req, res) => {
  console.dir(req.body);
  res.send("Hello World!!!");
});

module.exports = sampleRouter;
