const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const config = require("../test.config");

const url = `${config.protocol}://${config.host}:${config.port}${config.path.testDev}`;

// Start web server
const server = require("./bin/runHttpServer");

function exit(){
  server.close();
  process.exit(0);
}

const folderPath = path.join(__dirname, "coverage");
const pathToCoverage = path.join(folderPath, "coverage.json");
if(!fs.existsSync(folderPath)){
  fs.mkdirSync(folderPath, {recursive: true});
}

const runCoverage = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--app=${url}`, `--window-size=${800},${600}`],
  });
  const pages = await browser.pages();
  const page = pages[0];
  
  await page.waitForFunction(() => window.__mochaFinished__);
  
  const coverage = await page.evaluate(() => window.__coverage__);
  let data = JSON.stringify(coverage);
  
  /**
   * Since source map path will be /dist:webpack:///./src/.... which cannot be reached,
   * modify correct src path as below.
   */
  // data = data.replace(/webpack:\/\/\/.\/src\//g, "../src/");
  data = data.replace(/webpack:\/\/xspy\/.\/src\//g, "../src/");
  
  await fs.promises.writeFile(pathToCoverage, data);
};

runCoverage()
  .catch(console.error)
  .finally(exit);
