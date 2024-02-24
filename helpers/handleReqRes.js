const notFoundRouter = require("../handlers/routeHandlers/notFoundHandler");
const routes = require("../routes");

const handleReqRes = (app) => {
  Object.keys(routes).forEach((path) => {
    app.use(`/${path}`, routes[path]);
  });

  // Handle not found routes
  app.use("*", notFoundRouter);
};

module.exports = handleReqRes;
