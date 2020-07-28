const express = require("express");
const path = require("path");
const config = require("../test.config");

const app = express();

app.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));
app.use("/test.config.js", express.static(path.join(__dirname, "../test.config.js")));
app.use(config.path.test, express.static(path.join(__dirname, "../test")));
app.get(config.path.api.normal, function (req, res) {
  res.send("normal");
});
app.get(config.path.api.timeout, function (req, res) {
  setTimeout(() => {
    res.send("timeout");
  }, 99999999);
});

const server = app.listen(config.port);

// require("./runBrowser");

module.exports = server;
