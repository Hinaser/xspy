const config = {
  protocol: "http",
  host: "localhost",
  port: 18888,
  path: {
    test: "/test",
    api: {
      normal: "/api/normal",
      timeout: "/api/timeout",
      invalidXml: "/api/invalid-xml",
      auth: "/api/auth",
    },
  },
};

(function(global){
  if(typeof exports === "object"){
    module.exports = config;
  }
  else{
    global.testConfig = config;
  }
}(this));
