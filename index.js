const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/abc", (req, res) => {
  res.send("Hello World!!!");
});

app.post("/abc", (req, res) => {
  console.dir(req.body);
  res.send("Hello World!!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
