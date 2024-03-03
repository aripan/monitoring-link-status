require("dotenv").config();
const environments = {};

environments.staging = {
  port: process.env.STAGING_PORT,
  secret: process.env.STAGING_SECRET_KEY,
  envName: "staging",
};

environments.production = {
  port: process.env.PRODUCTION_PORT,
  secret: process.env.PRODUCTION_SECRET_KEY,
  envName: "production",
};

// determine environment
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

// export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
