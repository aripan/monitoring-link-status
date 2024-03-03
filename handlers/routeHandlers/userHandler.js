const express = require("express");
const { sendResponse } = require("../../helpers/handleResponse");
const {
  checkMethod,
  ensureJSON,
  typeAndLengthCheck,
} = require("../../middleware/middleware");
const crudLib = require("../../lib/crudData");
const { hashedPassword } = require("../../helpers/utilities");
const userRouter = express.Router();

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

userRouter.use(restrictions);

//@ get all users
userRouter.get("/", async (req, res) => {
  try {
    const { status, data } = await crudLib.readData("test-db", "new-data");
    if (status !== 200) return res.status(400).send({ message });
    data.length > 0
      ? res.status(status).send({ data })
      : res.status(404).send({ message: "Not found" });
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

//@ get user using email address
userRouter.get("/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { status, data } = await crudLib.readData("test-db", "new-data");

    if (status !== 200) return res.status(400).send({ message });

    const user = data.find((user) => user.email === userEmail);

    user
      ? res.status(status).send({ data: user })
      : res.status(404).send({ message: "user not found" });
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

// @ add new user
userRouter.post("/", async (req, res) => {
  const { firstName, lastName, email, password, tosAgreement } = req.body;

  const isFirstNameValid = typeAndLengthCheck(firstName, "string");
  const isLastNameValid = typeAndLengthCheck(lastName, "string");
  const isEmailValid = typeAndLengthCheck(email, "string");
  const isPasswordValid = typeAndLengthCheck(password, "string");

  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isPasswordValid &&
    firstName &&
    lastName &&
    email &&
    password &&
    tosAgreement
  ) {
    try {
      const securedPassword = hashedPassword(password);
      const { status, message } = await crudLib.createData(
        "test-db",
        "new-data",
        {
          firstName,
          lastName,
          email,
          password: securedPassword,
          tosAgreement,
        }
      );

      res.status(status).send({ message });
    } catch (error) {
      res.status(400).send({ message: "There is a problem in your request" });
    }
  } else {
    res
      .status(400)
      .send({ message: "Your request does not meet the requirements" });
  }
});

//@ update user data
userRouter.put("/", async (req, res) => {
  const { password } = req.body;
  let updateFields = {};
  if (password) {
    const securedPassword = hashedPassword(password);
    updateFields = {
      ...req.body,
      password: securedPassword,
    };
  } else {
    updateFields = {
      ...req.body,
    };
  }
  try {
    const { status, message } = await crudLib.updateData(
      "test-db",
      "new-data",
      updateFields
    );

    if (status !== 200) return res.status(400).send({ message });

    return res.status(status).send({ message });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Your request does not meet the requirements" });
  }
});

//@ delete user data
userRouter.delete("/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { status, message } = await crudLib.deleteData(
      "test-db",
      "new-data",
      userEmail
    );

    if (status !== 204) return res.status(400).send({ message });

    res.status(status).send({ message });
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

module.exports = userRouter;
