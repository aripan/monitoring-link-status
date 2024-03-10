const express = require("express");
const { restrictions } = require("../../middleware/middleware");
const crudLib = require("../../lib/crudData");
const {
  hashedPassword,
  comparePassword,
  typeAndLengthCheck,
} = require("../../helpers/utilities");
const {
  createEncodedToken,
  verifyEncodedToken,
} = require("../../helpers/customTokens/encodedToken");
const userRouter = express.Router();

// middleware to apply few restrictions
userRouter.use(restrictions);

/*
@ Public API
@ User sign up
*/
userRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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
    password
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
        }
      );

      if (status !== 201) return res.status(status).send({ message });

      // create the encoded token
      const tokenPayload = {
        firstName,
        lastName,
        email,
      };

      const createdToken = createEncodedToken(tokenPayload, "10min");

      if (!createdToken)
        return res.status(500).send({ message: "Internal error" });

      // store the token in cookies
      res.cookie("accessToken", createdToken, {
        httpOnly: true,
        maxAge: 900000,
        signed: true,
      });

      res.status(status).send({ message: "User signed up successfully" });
    } catch (error) {
      res.status(400).send({ message: "There is a problem in your request" });
    }
  } else {
    res
      .status(400)
      .send({ message: "Your request does not meet the requirements" });
  }
});

/*
@Public API
@ User sign in using email and password
*/
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { status, data } = await crudLib.readData("test-db", "new-data");

    if (status !== 200) return res.status(400).send({ message });

    const user = data.find((user) => user.email === email);

    if (!user) return res.status(404).send({ message: "user not found" });

    // compare password
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Unauthorized" });

    // create the encoded token
    const tokenPayload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const createdToken = createEncodedToken(tokenPayload, "10min");

    if (!createdToken)
      return res.status(500).send({ message: "Internal error" });

    // store the token in cookies
    res.cookie("accessToken", createdToken, {
      httpOnly: true,
      maxAge: 900000,
      signed: true,
    });

    res.status(status).send({ message: "User signed in successfully" });
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

/*
@ Private API
@ User sign out
*/
userRouter.delete("/logout", verifyEncodedToken, async (req, res) => {
  try {
    if (req.signedCookies["accessToken"]) {
      res.clearCookie("accessToken");
      res.status(204).send({ message: "User signed out successfully" });
    } else {
      res.status(400).send({ message: "Bad request" });
    }
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

/*
@ Private API
@ User update
*/
userRouter.put("/:email", verifyEncodedToken, async (req, res) => {
  const userEmail = req.params.email;
  const { email } = req.user;

  // check if the requested user is valid or not
  if (email !== userEmail)
    return res.status(401).send({ message: "User is not allowed!!!" });

  // check if user wants to update the password also
  const { password } = req.body;
  let updateFields = {};

  // Check if email is included in req.body
  if ("email" in req.body) {
    return res.status(400).json({ error: "Email cannot be updated" });
  }

  // incase of password needs to be updated => hash the password
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
      userEmail,
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

/*
@ Private API
@ User - get user using email address
*/
userRouter.get("/:email", verifyEncodedToken, async (req, res) => {
  try {
    const userEmail = req.params.email;
    const { firstName, lastName, email } = req.user;

    // check if the requested user is valid or not
    if (email !== userEmail)
      return res.status(401).send({ message: "User is not allowed!!!" });

    return res.status(200).send({ user: { firstName, lastName, email } });

    //! previously getting the data from database, but later on it seems that user is already present in the header

    // const { status, data } = await crudLib.readData("test-db", "new-data");

    // if (status !== 200) return res.status(400).send({ message });

    // const user = data.find((user) => user.email === userEmail);

    // user
    //   ? res.status(status).send({
    //       user: {
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         email: user.email,
    //       },
    //     })
    //   : res.status(404).send({ message: "user not found" });
  } catch (error) {
    res.status(400).send({ message: "There is a problem in your request" });
  }
});

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

module.exports = userRouter;
