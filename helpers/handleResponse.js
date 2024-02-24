const sendResponse = (res, statusCode, payload) => {
  statusCode = typeof statusCode === "number" ? statusCode : 500;
  payload = typeof payload === "object" ? payload : {};

  // stringify the payload
  const payloadString = JSON.stringify(payload);

  res.writeHead(statusCode);
  res.end(payloadString);
};

module.exports = { sendResponse };
