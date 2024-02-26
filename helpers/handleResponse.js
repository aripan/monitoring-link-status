const sendResponse = (res, statusCode, payload) => {
  // console.log("🚀 ~ sendResponse ~ payload:",statusCode, payload);
  statusCode = typeof statusCode === "number" ? statusCode : 500;
  payload = typeof payload === "object" ? payload : {};

  // stringify the payload
  const payloadString = JSON.stringify(payload);

  //@ one way to format the response
  // res.format({
  //   json() {
  //     res.status(statusCode).end(payloadString);
  //   },
  // });

  //@ another way to format the response
  res.type("application/json").status(statusCode).end(payloadString);
};

module.exports = { sendResponse };
