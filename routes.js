const dbRouter = require("./handlers/routeHandlers/databaseHandler");
const sampleRouter = require("./handlers/routeHandlers/sampleHandler");
const userRouter = require("./handlers/routeHandlers/userHandler");

const routes = {
  db: dbRouter,
  sample: sampleRouter,
  user: userRouter,
};

module.exports = routes;
