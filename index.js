const express = require("express");
const handleReqRes = require("./helpers/handleReqRes");
const routes = require("./routes");

const app = express();
const port = 3000;

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

handleReqRes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
