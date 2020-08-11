const fs = require("fs");
const path = require("path");

const lcovPath = path.join(__dirname, "..", "..", "docs", "coverage", "lcov.info");

if(!fs.existsSync(lcovPath)){
  console.log("lcov.info was not found at: ", lcovPath);
  return;
}

fs.readFile(lcovPath, (err, data) => {
  if(err){
    throw err;
  }
  
  let newData = "";
  
  if(data instanceof Buffer){
    newData = data.toString();
  }
  else if(typeof data === "string"){
    newData = data;
  }
  
  newData = newData.replace(/\\/g, "/");
  
  fs.writeFile(lcovPath, newData, (errInWrite) => {
    if(errInWrite){
      throw errInWrite;
    }
  });
});