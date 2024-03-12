const jwt = require("jsonwebtoken");
const environmentToExport = require("../environment");

const createEncodedToken = (tokenPayload, options, type = "accessToken") => {
  const secretKey =
    type === "refreshToken"
      ? environmentToExport.refreshTokenSecret
      : environmentToExport.accessTokenSecret;
  return jwt.sign(tokenPayload, secretKey, options);
};

const verifyEncodedToken = (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  const accessTokenSecretKey = environmentToExport.accessTokenSecret;
  const refreshTokenSecretKey = environmentToExport.refreshTokenSecret;

  if (!accessToken || !refreshToken) {
    return res.status(401).send({ message: "Unauthorized: Token is missing" });
  }

  let token = accessToken;
  let secretKey = accessTokenSecretKey;
  let isRefreshToken = false;

  const accessTokenPayload = verifyTokenPayload(
    accessToken,
    accessTokenSecretKey
  );

  if (accessTokenPayload.payload) {
    req.user = accessTokenPayload.payload;
    return next();
  }

  if (!accessTokenPayload.payload) {
    token = refreshToken;
    secretKey = refreshTokenSecretKey;
    isRefreshToken = true;
  }

  const { payload, expired } = verifyTokenPayload(token, secretKey);

  if (!payload || expired) {
    return res
      .status(401)
      .send({ message: "Unauthorized: Both token are invalid!!!" });
  }

  if (isRefreshToken) {
    const { firstName, lastName, email } = payload;
    const newAccessTokenPayload = { firstName, lastName, email };
    const newAccessTokenOptions = {
      expiresIn: "1min",
      issuer: email,
      audience: email,
    };
    const newAccessToken = createEncodedToken(
      newAccessTokenPayload,
      newAccessTokenOptions
    );

    res.cookie("accessToken", newAccessToken, { httpOnly: true, signed: true });

    req.user = verifyTokenPayload(newAccessToken, accessTokenSecretKey).payload;
    console.info("Using new access token");
    return next();
  } else {
    return next(error);
  }
};

const verifyTokenPayload = (token, secretKey) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    const { firstName, lastName, email, exp, aud } = decoded;

    return {
      payload: {
        firstName,
        lastName,
        email,
        exp,
        aud,
      },
      expired: false,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return {
        payload: null,
        expired: true,
      };
    } else {
      console.error("Error verifying token:", error.message);
      return {
        payload: null,
        expired: false,
        error: error.message,
      };
    }
  }
};

module.exports = { createEncodedToken, verifyEncodedToken };
