const express = require("express");
const notFoundRouter = express.Router();

notFoundRouter.get("/", (req, res) => {
  console.dir(req.query);
  res.send("Not Found");
});

module.exports = notFoundRouter;
