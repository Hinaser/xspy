const Nightmare = require("nightmare");
const fs = require("fs");
const path = require("path");
const config = require("../test.config");

const url = `${config.protocol}://${config.host}:${config.port}${config.path.test}`;
const nightmare = Nightmare({show: true});

function exit(err){
  console.error(err);
  process.exit(1);
}

// Start web server
const server = require("../bin/runHttpServer");

nightmare
  .goto(url)
  .evaluate(() => window.__coverage__)
  .end()
  .then(coverage => {
    const pathToCoverage = path.join(__dirname, "coverage", "coverage.json");
    const data = JSON.stringify(coverage);
    const errorHandler = (err) => {
      if(err){
        exit(err);
      }
    };
    fs.writeFile(pathToCoverage, data, errorHandler);
  })
  .catch(exit)
  .finally(() => {
    server.close();
  })
;