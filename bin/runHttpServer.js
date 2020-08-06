const express = require("express");
const path = require("path");
const config = require("../test.config");

const app = express();

app.use(express.json());
app.use("/node_modules", express.static(path.join(__dirname, "../node_modules")));
app.use("/test.config.js", express.static(path.join(__dirname, "../test.config.js")));
app.use(config.path.test, express.static(path.join(__dirname, "../test")));
app.get(config.path.api.normal, function (req, res) {
  res.contentType("application/json");
  res.send({result: "normal"});
});
app.get(config.path.api.timeout, function (req, res) {
  setTimeout(() => {
    res.send("timeout");
  }, 99999999);
});
app.get(config.path.api.validXml, function (req, res) {
  res.contentType("text/xml");
  res.send("<root><title>test</title></root>");
});
app.get(config.path.api.invalidXml, function (req, res) {
  res.contentType("text/xml");
  res.send("not-valid-xml");
});
app.get(config.path.api.auth, function (req, res) {
  const authorization = req.get("Authorization");
  if(authorization === "test-authorization"){
    res.send("ok");
    return;
  }
  
  res.status(401).end();
});
app.post(config.path.api.post, function (req, res) {
  if(req.method === "POST" && typeof req.body === "object" && req.body.test === 1){
    res.json({test: true});
    return;
  }
  else{
    res.status(400).send(req.body);
  }
});

const server = app.listen(config.port);

// require("./runBrowser");

module.exports = server;
