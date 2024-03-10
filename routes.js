const dbRouter = require("./handlers/routeHandlers/databaseHandler");
const sampleRouter = require("./handlers/routeHandlers/sampleHandler");
const tokenRouter = require("./handlers/routeHandlers/tokenHandler");
const userRouter = require("./handlers/routeHandlers/userHandler");

const routes = {
  db: dbRouter,
  sample: sampleRouter,
  user: userRouter,
  token: tokenRouter,
};

module.exports = routes;
