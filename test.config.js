var config = {
  protocol: "http",
  host: "localhost",
  port: 18888,
  path: {
    test: "/test",
    testEs5: "/test/index.es5.html",
    testProd: "/test/index.prod.html",
    testProdEs5: "/test/index.prod.es5.html",
    dist: "/dist",
    api: {
      normal: "/api/normal",
      timeout: "/api/timeout",
      invalidXml: "/api/invalid-xml",
      validXml: "/api/valid-xml",
      auth: "/api/auth",
      post: "/api/post",
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
