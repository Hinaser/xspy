const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("../..//test.config");
const server = require("./runHttpServer");

const args = process.argv.slice(2);

const browserStartCommand = (()=>{
  if(args[0]){
    if(args[0] === "ie" || args[1] === "ie"){
      const iePath = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
      const iePathX86 = "C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe";
      if(fs.existsSync(iePath)){
        return `"${iePath}"`;
      }
      else if(fs.existsSync(iePathX86)){
        return `"${iePathX86}"`;
      }
      
      console.error("Could not find Internet Explorer at " + iePath);
      process.exit(1);
      return;
    }
  }
  
  if(process.platform === "darwin"){
    return "open";
  }
  else if(process.platform === "win32"){
    return "start";
  }
  
  return "xdg-open";
})();

let url = `${config.protocol}://${config.host}:${config.port}`;
if(args[0] === "ie"){
  url = `${url}${config.path.testDevEs5}`;
}
else if(args[0] === "prod"){
  if(args[1] === "ie"){
    url = `${url}${config.path.testProdEs5}`;
  }
  else{
    url = `${url}${config.path.testProd}`;
  }
}
else{
  url = `${url}${config.path.testDev}`;
}

const command = browserStartCommand + " " + url;
console.log("Run: " + command);
childProcess.exec(command);
