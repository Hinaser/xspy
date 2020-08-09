const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("../test.config");
const server = require("./runHttpServer");

const args = process.argv.slice(2);

const browserStartCommand = (()=>{
  if(args[0]){
    if(args[0] === "ie"){
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
    else{
      console.error("Unknown browser");
      process.exit(1);
      return;
    }
    
    console.error("Unknown option: ", args[0]);
    process.exit(1);
    return;
  }
  
  if(process.platform === "darwin"){
    return "open";
  }
  else if(process.platform === "win32"){
    return "start";
  }
  
  return "xdg-open";
})();

const url = `${config.protocol}://${config.host}:${config.port}${args[0] === "ie" ? config.path.testEs5 : config.path.test}`;

const command = browserStartCommand + " " + url;
console.log("Run: " + command);
childProcess.exec(command);
