const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const { createDatabase } = require("../../helpers/database");
const dbRouter = express.Router();

dbRouter.get("/", (req, res) => {
  sendResponse(res, 202, {
    message: "This is db route",
  });
});

dbRouter.post("/", async (req, res) => {
  const { fileName, data } = req.body;
  try {
    // Attempt to create the database
    await createDatabase(fileName, data);

    // Log success message
    console.log("Database created successfully");

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

module.exports = dbRouter;
