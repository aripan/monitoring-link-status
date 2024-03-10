const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const {
  typeAndLengthCheck,
  checkMethod,
  ensureJSON,
} = require("../../middleware/middleware");
const crudLib = require("../../lib/crudData");
const { comparePassword, createToken } = require("../../helpers/utilities");
const {
  printValue,
  createEncryptedToken,
} = require("../../helpers/customTokens/encryptedToken");
const tokenRouter = express.Router();

// Middleware to restrict HTTP methods
const restrictions = (req, res, next) => {
  const methodError = checkMethod(req.method);
  const jsonError = ensureJSON(req.get("Content-Type"));
  if (methodError) {
    return sendResponse(res, 405, methodError);
  }
  if (jsonError) {
    return sendResponse(res, 400, jsonError);
  }
  next();
};

tokenRouter.use(restrictions);

tokenRouter.post("/", async (req, res) => {
  const { email, password } = req.body;
  const isEmailValid = typeAndLengthCheck(email, "string");
  const isPasswordValid = typeAndLengthCheck(password, "string");

  // Validate email and password
  if (!email || !password || !isEmailValid || !isPasswordValid) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    //check if the user exist
    const { status, data } = await crudLib.readData("test-db", "new-data");

    if (!data.length) return res.status(404).send({ message: "Not found" });

    const user = data.find((dUser) => dUser.email === email);

    if (!user) return res.status(404).send({ message: "User not found" });

    // compare password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Unauthorized" });

    // create a token for the user
    const tokenPayload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const createdToken = createToken(tokenPayload);
    return res.status(status).send({ createdToken });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

tokenRouter.get("/", (req, res) => {
  const tokenPayload = {
    firstName: "Katy",
    lastName: "Parry",
    email: "katy@parry.com",
  };
  // Replace with your own encryption key
  const encryptedToken = createEncryptedToken(tokenPayload);
  // console.log("🚀 ~ tokenRouter.get ~ encryptedToken:", encryptedToken);

  return res.status(200).send({ encryptedToken });
});
tokenRouter.put("/", (req, res) => {});
tokenRouter.delete("/", (req, res) => {});

module.exports = tokenRouter;
