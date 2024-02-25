const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const {
  createDatabase,
  readDatabase,
  updateDatabase,
  deleteDatabase,
} = require("../../helpers/database");
const dbRouter = express.Router();

dbRouter.get("/", async (req, res) => {
  const { fileName } = req.query;
  try {
    const data = await readDatabase(fileName);
    sendResponse(res, 200, {
      message: data,
    });
  } catch (error) {
    // Log and handle errors
    console.error("Error creating database:", error);

    // Send error response to the client
    sendResponse(res, 500, {
      error: "Internal Server Error",
    });
  }
});

dbRouter.post("/", async (req, res) => {
  const { fileName, data } = req.body;
  try {
    // Attempt to create the database
    await createDatabase(fileName, data);

    // Send success response to the client
    sendResponse(res, 201, {
      message: "Database has been created",
    });
  } catch (error) {
    // Log and handle errors
    console.error("Error creating database:", error);

    // Send error response to the client
    sendResponse(res, 500, {
      error: "Internal Server Error",
    });
  }
});

dbRouter.put("/", async (req, res) => {
  const { fileName, data } = req.body;
  try {
    await updateDatabase(fileName, data);
    sendResponse(res, 200, { message: "data updated successfully" });
  } catch (err) {
    sendResponse(res, 400, { message: err });
  }
});

dbRouter.delete("/", async (req, res) => {
  const { fileName } = req.body;
  try {
    await deleteDatabase(fileName);
    sendResponse(res, 204, { message: "data deleted successfully" });
  } catch (err) {
    console.log("🚀 ~ dbRouter.delete ~ err:", err);
    sendResponse(res, 400, { message: err });
  }
});

module.exports = dbRouter;
