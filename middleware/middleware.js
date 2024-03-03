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

const typeAndLengthCheck = (expectedData, expectedType) => {
  if (typeof expectedData === expectedType && expectedData.length > 0) {
    return true;
  }
  return false;
};

module.exports = { checkMethod, ensureJSON, typeAndLengthCheck };
