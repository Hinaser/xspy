var baseApiUrl  = testConfig.protocol + "://" + testConfig.host + ":" + testConfig.port;
var normalApiResponseUrl = baseApiUrl + testConfig.path.api.normal;
var timeoutApiResponseUrl = baseApiUrl + testConfig.path.api.timeout;
var invalidXMLApiResponseUrl = baseApiUrl + testConfig.path.api.invalidXml;

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
  
    describe("behaviour for various readyState", function(){
      describe("on unsent", function(){
        it("readyState is set to UNSENT", function(){
          var xhr = new XMLHttpRequest();
          expect(xhr.readyState).to.be(XMLHttpRequest.UNSENT);
        });
        it("throws Error when calling 'setRequestHeader before XHR is opened", function(){
          var xhr = new XMLHttpRequest();
          expect(function(){xhr.setRequestHeader("name", "value")}).to.throwError();
        });
        it("getAllResponseHeaders returns empty string. (MDN says it should return null by the way...)", function(){
          var xhr = new XMLHttpRequest();
          expect(xhr.getAllResponseHeaders()).to.empty();
        });
        it("getResponseHeader returns null", function(){
          var xhr = new XMLHttpRequest();
          expect(xhr.getResponseHeader("content-type")).to.be(null);
        });
      });
      
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
        it("throws an Error when just an argument is passed", function(){
          var xhr = new XMLHttpRequest();
          expect(function(){xhr.open("GET")}).to.throwError();
        });
        it("does not throws Error when calling 'setRequestHeader", function(){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", normalApiResponseUrl);
          expect(function(){xhr.setRequestHeader("name", "value")}).to.not.throwError();
        });
      });
      
      describe("on sent", function(){
        it("should throw an Error on sent if it is not yet OPENED", function(){
          var xhr = new XMLHttpRequest();
          expect(function(){xhr.send()}).to.throwError();
        });
        it("onreadystatechange event is triggered in order", function(done){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", normalApiResponseUrl);
          var expectedReadyState = XMLHttpRequest.HEADERS_RECEIVED;
          xhr.onreadystatechange = function(){
            expect(this.readyState).to.be(expectedReadyState++);
            if(this.readyState === XMLHttpRequest.DONE){
              done();
            }
          };
          xhr.send();
        });
        describe("request header", function(){
          it("setRequestHeader does not throw an Error", function(){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            expect(function(){xhr.setRequestHeader("test-header", "test-value")}).not.to.throwError();
            xhr.send();
          });
          it("setRequestHeader does not throw an Error when setting duplicate name header", function(){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.setRequestHeader("test-header", "test-value")
            expect(function(){xhr.setRequestHeader("test-header", "test-value2")}).not.to.throwError();
            xhr.send();
          });
        });
        describe("event listeners", function(){
          it("should fire onloadstart event listener", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.addEventListener("loadstart", function(){
              done();
            });
            xhr.send();
          });
          it("should fire onloadstart function", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onloadstart = function(){
              done();
            }
            xhr.send();
          });
          it("should fire onload event listener", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.addEventListener("load", function(){
              done();
            });
            xhr.send();
          });
          it("should fire onload function", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onload = function(){
              done();
            }
            xhr.send();
          });
          it("should fire onloadend event listener", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.addEventListener("loadend", function(){
              done();
            });
            xhr.send();
          });
          it("should fire onloadend function", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onloadend = function(){
              done();
            }
            xhr.send();
          });
          it("should fire multiple onloadend event listener", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            let counter = 0;
            xhr.addEventListener("loadend", function(){
              counter++;
              if(counter > 1){
                done();
              }
            });
            xhr.addEventListener("loadend", function(){
              counter++;
              if(counter > 1){
                done();
              }
            });
            xhr.send();
          });
          it("should not fire removed onloadend event listener", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            var removingListener = function(){
              throw new Error("Should not be called");
            };
            xhr.addEventListener("loadstart", removingListener);
            xhr.addEventListener("loadstart", function(){
              done();
            });
            xhr.removeEventListener("loadstart", removingListener);
            xhr.send();
          });
          it("does nothing when removing unregistered event listener", function(){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.removeEventListener("loadstart", function(){
              throw new Error("Never be called");
            });
            xhr.send();
          });
        });
        describe("response headers", function(){
          it("getAllResponseHeaders returns non-empty string", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === XMLHttpRequest.DONE){
                expect(this.getAllResponseHeaders()).to.not.empty();
                done();
              }
            };
            xhr.send();
          });
          it("getResponseHeader returns non-empty string", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === XMLHttpRequest.DONE){
                expect(this.getResponseHeader("content-type")).to.not.empty();
                done();
              }
            };
            xhr.send();
          });
          it("getResponseHeader returns null when unknown header name is specified", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", normalApiResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === XMLHttpRequest.DONE){
                expect(this.getResponseHeader("never-existing-header-name")).to.be(null);
                done();
              }
            };
            xhr.send();
          });
          it("does not throws error when receiving invalid xml with 'content-type: text/xml' after override mime type", function(){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", invalidXMLApiResponseUrl);
            xhr.overrideMimeType("text/plain");
            expect(function(){xhr.send()}).not.to.throwError();
          });
        });
        describe("timeout", function(){
          it("ontimeout event listener is called", function(done){
            var xhr = new XMLHttpRequest();
            xhr.timeout = 1000;
            xhr.addEventListener("timeout", function(){
              done();
            });
            xhr.open("GET", timeoutApiResponseUrl);
            xhr.send();
          });
          it("ontimeout function is called", function(done){
            var xhr = new XMLHttpRequest();
            xhr.timeout = 1000;
            xhr.ontimeout = function(){
              done();
            };
            xhr.open("GET", timeoutApiResponseUrl);
            xhr.send();
          });
        });
        describe("abort", function(){
          it("onabort event listener is called", function(done){
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("abort", function(){
              // According to https://xhr.spec.whatwg.org/#the-abort()-method ,
              // readyState should be set to 0 when it is DONE.
              // MDN
              // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort
              // says readyState should be 0 when aborting, but in actual browser it is set to DONE(4).
              /*
              expect(this.readyState).to.be(this.UNSENT);
              */
              expect(this.status).to.be(0);
              done();
            });
            xhr.open("GET", timeoutApiResponseUrl);
            xhr.send();
            xhr.abort();
          });
          it("onabort function is called", function(done){
            var xhr = new XMLHttpRequest();
            xhr.onabort = function(){
              // According to https://xhr.spec.whatwg.org/#the-abort()-method ,
              // readyState should be set to 0 when it is DONE.
              // MDN
              // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort
              // says readyState should be 0 when aborting, but in actual browser it is set to DONE(4).
              /*
              expect(this.readyState).to.be(this.UNSENT);
              */
              expect(this.status).to.be(0);
              done();
            };
            xhr.open("GET", timeoutApiResponseUrl);
            xhr.send();
            xhr.abort();
          });
        })
      });
    });
  });
});
