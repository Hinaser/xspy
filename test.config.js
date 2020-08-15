var config = {
  protocol: "http",
  host: "localhost",
  port: 18888,
  path: {
    test: "/test",
    testDev: "/test/entry/index.html",
    testDevEs5: "/test/entry/index.es5.html",
    testProd: "/test/entry/index.prod.html",
    testProdEs5: "/test/entry/index.prod.es5.html",
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
    global.__test__ = {};
    global.__test__.testConfig = config;
    
    var baseApiUrl = config.protocol + "://" + config.host + ":" + config.port;
    
    global.__test__.baseApiUrl = baseApiUrl;
    global.__test__.normalApiResponseUrl = baseApiUrl + config.path.api.normal;
    global.__test__.timeoutApiResponseUrl = baseApiUrl + config.path.api.timeout;
    global.__test__.invalidXMLApiResponseUrl = baseApiUrl + config.path.api.invalidXml;
    global.__test__.authRequiredResponseUrl = baseApiUrl + config.path.api.auth;
    global.__test__.validXMLUrl = baseApiUrl + config.path.api.validXml;
    global.__test__.postUrl = baseApiUrl + config.path.api.post;
  
    var userAgent = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "";

    // If browser is not IE, IEVersion will be false
    var IEVersion = (function(){
      var version = parseInt((/msie (\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
      if (isNaN(version)) {
        version = parseInt((/trident\/.*; rv:(\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
        if(isNaN(version)){
          return false;
        }
        return version;
      }
      return version;
    })();
  
    function isIE(op, version){
      if(IEVersion === false) return false;
      else if(!version) return true;
      else if(op === "<") return IEVersion < version;
      else if(op === "<=") return IEVersion <= version;
      else if(op === ">") return IEVersion > version;
      else if(op === ">=") return IEVersion >= version;
      else if(op === "=") return IEVersion === version;
      return IEVersion === version;
    }
  
    global.__test__.IEVersion = IEVersion;
    global.__test__.isIE = isIE;
  }
}(this));
