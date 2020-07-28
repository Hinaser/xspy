const childProcess = require("child_process");
const config = require("../test.config");
const server = require("./runHttpServer");

const browserStartCommand = (()=>{
  if(process.platform === "darwin"){
    return "open";
  }
  else if(process.platform === "win32"){
    return "start";
  }
  
  return "xdg-open";
})();

const url = `${config.protocol}://${config.host}:${config.port}${config.path.test}`;

childProcess.exec(browserStartCommand + " " + url);
