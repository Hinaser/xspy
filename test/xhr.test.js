var baseApiUrl  = testConfig.protocol + "://" + testConfig.host + ":" + testConfig.port;
var normalApiResponseUrl = baseApiUrl + testConfig.path.api.normal;
var timeoutApiResponseUrl = baseApiUrl + testConfig.path.api.timeout;

describe("fetch-xhr-hook", function(){
  describe("xhr-hook", function(){
    describe("object structure of hooked XMLHttpRequest", function(){
      var xhr = new XMLHttpRequest();
    
      describe("properties", function(){
        it("has property 'onreadystatechange'", function(){
          expect(xhr).to.have.property("onreadystatechange");
        });
        it("has property 'readyState'", function(){
          expect(xhr).to.have.property("readyState");
        });
        it("has property 'status'", function(){
          expect(xhr).to.have.property("status");
        });
        it("initial value of status is 0", function(){
          expect(xhr.status).to.be(0);
        });
        it("has property 'statusText'", function(){
          expect(xhr).to.have.property("statusText");
        });
        it("initial value of statusText is empty", function(){
          expect(xhr.statusText).to.be.empty();
        });
        it("has property 'timeout'", function(){
          expect(xhr).to.have.property("timeout");
        });
        it("initial value of timeout is 0", function(){
          expect(xhr.timeout).to.be(0);
        });
        it("has property 'upload'", function(){
          expect(xhr).to.have.property("upload");
        });
        it("has property 'withCredentials'", function(){
          expect(xhr).to.have.property("withCredentials");
        });
      });
      
      describe("methods", function(){
        it("has methods 'abort'", function(){
          expect(xhr).to.have.property("abort");
        });
        it("has methods 'getAllResponseHeaders'", function(){
          expect(xhr).to.have.property("getAllResponseHeaders");
        });
        it("has methods 'getResponseHeader'", function(){
          expect(xhr).to.have.property("getResponseHeader");
        });
        it("has methods 'open'", function(){
          expect(xhr).to.have.property("open");
        });
        it("has methods 'overrideMimeType'", function(){
          expect(xhr).to.have.property("overrideMimeType");
        });
        it("has methods 'send'", function(){
          expect(xhr).to.have.property("send");
        });
        it("has methods 'setRequestHeader'", function(){
          expect(xhr).to.have.property("setRequestHeader");
        });
      });
    });
  
    describe("XHR status transition", function(){
      describe("on open", function(){
        it("readyState is set to OPENED", function(){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", normalApiResponseUrl);
          expect(xhr.readyState).to.be(XMLHttpRequest.OPENED);
        });
        it("onreadystatechange event is triggered and readyState is OPENED", function(done){
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function(){
            expect(this.readyState).to.be(this.OPENED);
            done();
          };
          xhr.open("GET", normalApiResponseUrl);
        });
      });
    });
  });
});
