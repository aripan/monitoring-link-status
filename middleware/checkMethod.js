const checkMethod = (method) => {
  const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!allowedMethods.includes(method)) {
    return {
      error: "Method Not Allowed",
    };
  }
  return null; // Indicates no error
};

module.exports = { checkMethod };
