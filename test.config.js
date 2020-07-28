const config = {
  protocol: "http",
  host: "localhost",
  port: 18888,
  path: {
    test: "/test",
    api: {
      normal: "/api/normal",
      timeout: "/api/timeout",
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
