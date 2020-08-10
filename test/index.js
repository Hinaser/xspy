const Nightmare = require("nightmare");
const fs = require("fs");
const path = require("path");
const config = require("../test.config");

const url = `${config.protocol}://${config.host}:${config.port}${config.path.testDev}`;
const nightmare = Nightmare({
  show: true,
});

// Start web server
const server = require("./bin/runHttpServer");

function exit(){
  server.close();
  process.exit(0);
}

nightmare
  .goto(url)
  .wait(() => window.__mochaFinished__)
  .evaluate(() => window.__coverage__)
  .end()
  .then(coverage => {
    const folderPath = path.join(__dirname, "..", "docs", "coverage");
    const pathToCoverage = path.join(folderPath, "coverage.json");
    if(!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath, {recursive: true});
    }
    
    let data = JSON.stringify(coverage);
  
    /**
     * Since source map path will be /dist:webpack:///./src/.... which cannot be reached,
     * modify correct src path as below.
     */
    // data = data.replace(/webpack:\/\/\/.\/src\//g, "../src/");
    data = data.replace(/webpack:\/\/fetchXhrHook\/.\/src\//g, "../src/");
    
    return new Promise((resolve, reject) => {
      const callback = (err) => {
        if(err){
          return reject(err);
        }
        return resolve();
      };
      fs.writeFile(pathToCoverage, data, callback);
    });
  })
  .catch(console.error)
  .finally(exit)
;