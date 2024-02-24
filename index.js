const express = require("express");
const { requestHandler } = require("./helpers/handleRequest");
const environmentToExport = require("./helpers/environment");

const app = express();
const port = environmentToExport.port;

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

requestHandler(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
