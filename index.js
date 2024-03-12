const express = require("express");
const cookieParser = require('cookie-parser');
const { requestHandler } = require("./helpers/handleRequest");
const environmentToExport = require("./helpers/environment");

const app = express();
const port = environmentToExport.port;

// parsing application/json
app.use(express.json());
// parsing cookies
app.use(cookieParser(environmentToExport.accessTokenSecret));
app.use(cookieParser(environmentToExport.refreshTokenSecret));

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

requestHandler(app);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
