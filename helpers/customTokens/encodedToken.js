const jwt = require("jsonwebtoken");
const environmentToExport = require("../environment");

const createEncodedToken = (tokenPayload, expiresIn = "7d") => {
  const secretKey = environmentToExport.secret;

  const token = jwt.sign(tokenPayload, secretKey, { expiresIn });

  return token;
};

const verifyEncodedToken = (req, res, next) => {
  const accessToken = req.signedCookies.accessToken;
  const secretKey = environmentToExport.secret;

  if (!accessToken) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Access token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(accessToken, secretKey);

    const { firstName, lastName, email, exp } = decoded;

    // current timestamp
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (currentTimeInSeconds >= exp)
      return res.status(403).send({ message: "Forbidden: Invalid token" });

    // Attach the decoded user information to the request object
    req.user = { firstName, lastName, email };

    // Move to the next middleware
    next();
  } catch (error) {
    return res.status(403).send({ message: "Forbidden: Invalid token" });
  }
};

module.exports = { createEncodedToken, verifyEncodedToken };
