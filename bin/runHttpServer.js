const express = require("express");
const path = require("path");
const config = require("../test.config");

const app = express();

app.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));
app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use(config.path.test, express.static(path.join(__dirname, "../test")));
app.get(config.path.api, function (req, res) {
  res.send("test");
})

app.listen(config.port);

require("./runBrowser");
