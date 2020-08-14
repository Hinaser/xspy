const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const config = require("../test.config");

const url = `${config.protocol}://${config.host}:${config.port}${config.path.testDev}`;

// Start web server
const server = require("./bin/runHttpServer");

let exitCode = 2;

function exit(){
  server.close();
  process.exit(exitCode);
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
  
  await page.waitForFunction(() => typeof window.__test_result__ !== "undefined");
  exitCode = (await page.evaluate(() => window.__test_result__)) ? 0 : 1;
  
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
  .catch((e) => {
    exitCode = 1;
    console.error(e);
  })
  .finally(() => {
    console.log(exitCode === 0 ? "Test passed!" : "Test failed")
    exit();
  });
