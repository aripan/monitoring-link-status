const dbRouter = require("./handlers/routeHandlers/databaseHandler");
const sampleRouter = require("./handlers/routeHandlers/sampleHandler");

const routes = {
  sample: sampleRouter,
  db: dbRouter,
};

module.exports = routes;
