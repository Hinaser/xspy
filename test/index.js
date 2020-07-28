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
    let data = JSON.stringify(coverage);
  
    /**
     * Since source map path will be /dist:webpack:///./src/.... which cannot be reached,
     * modify correct src path as below.
     */
    data = data.replace(/webpack:\/\/\/.\/src\//g, "../src/");
    
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