const checkMethod = (method) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(method)) {
    return {
      error: "Method Not Allowed",
    };
  }
  return null; // Indicates no error
};

const ensureJSON = (dataType) => {
  if (dataType !== "application/json") {
    return {
      error: "Content-Type must be application/json",
    };
  }
  return null; // Indicates no error
};

const restrictions = (req, res, next) => {
  const methodError = checkMethod(req.method);
  const jsonError = ensureJSON(req.get("Content-Type"));
  if (methodError) {
    return res.status(405).send({ message: methodError.error });
  }
  if (jsonError) {
    return res.status(400).send({ message: jsonError.error });
  }
  next();
};

module.exports = { restrictions };
