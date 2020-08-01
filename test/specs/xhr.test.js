var baseApiUrl  = testConfig.protocol + "://" + testConfig.host + ":" + testConfig.port;
var normalApiResponseUrl = baseApiUrl + testConfig.path.api.normal;
var timeoutApiResponseUrl = baseApiUrl + testConfig.path.api.timeout;
var invalidXMLApiResponseUrl = baseApiUrl + testConfig.path.api.invalidXml;
var authRequiredResponseUrl = baseApiUrl + testConfig.path.api.auth;
var htmlUrl = testConfig.protocol + "://" + testConfig.host + ":" + testConfig.port + "/test/index.html";

describe("fetch-xhr-hook", function(){
  describe("fetchXhrHook", function(){
    it("returns empty array if onRequest is not called", function(){
      expect(fetchXhrHook.getRequestListeners()).to.have.length(0);
    });
    it("returns appended request listener", function(){
      var listener = function(){};
      fetchXhrHook.onRequest(listener);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(1);
      fetchXhrHook.offRequest(listener);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(0);
    });
    it("a request listener already appended is not registered again", function(){
      var listener = function(){};
      fetchXhrHook.onRequest(listener);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(1);
      fetchXhrHook.onRequest(listener);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(1);
      fetchXhrHook.clearRequestHandler();
    });
    it("returns empty array when clearRequestHandler() is called", function(){
      fetchXhrHook.onRequest(function(){}, 0);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(1);
      fetchXhrHook.clearRequestHandler();
      expect(fetchXhrHook.getRequestListeners()).to.have.length(0);
    });
    it("returns empty array if onResponse is not called", function(){
      expect(fetchXhrHook.getResponseListeners()).to.have.length(0);
    });
    it("returns appended response listener", function(){
      var listener = function(){};
      fetchXhrHook.onResponse(listener);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(1);
      fetchXhrHook.offResponse(listener);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(0);
    });
    it("a response listener already appended is not registered again", function(){
      var listener = function(){};
      fetchXhrHook.onResponse(listener);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(1);
      fetchXhrHook.onResponse(listener);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(1);
      fetchXhrHook.clearResponseHandler();
    });
    it("returns empty array when clearResponseHandler() is called", function(){
      fetchXhrHook.onResponse(function(){}, 0);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(1);
      fetchXhrHook.clearResponseHandler();
      expect(fetchXhrHook.getResponseListeners()).to.have.length(0);
    });
    it("returns empty request/response array after clearAll() is called", function(){
      fetchXhrHook.onRequest(function(){}, 0);
      fetchXhrHook.onResponse(function(){}, 0);
      expect(fetchXhrHook.getRequestListeners()).to.have.length(1);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(1);
      fetchXhrHook.clearAll();
      expect(fetchXhrHook.getRequestListeners()).to.have.length(0);
      expect(fetchXhrHook.getResponseListeners()).to.have.length(0);
    });
  });
  describe("xhr-hook", function(){
    const checkXhrBehavior = function(useHook){
      describe(useHook ? "hooked XMLHttpRequest (fetchXhrHook enabled)" : "original XMLHttpRequest (fetchXhrHook disabled)", function(){
        before(function(){
          if(useHook){
            fetchXhrHook.enable();
          }
          else{
            fetchXhrHook.disable();
          }
        });
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
            describe("responseType", function(){
              it("returns json response when responseType is set to 'json'", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.responseType = "json";
                xhr.onreadystatechange = function(){
                  if(this.readyState === XMLHttpRequest.DONE){
                    expect(this.response).to.have.property("result");
                    done();
                  }
                };
                xhr.send();
              });
              it("returns text response when responseType is set to 'text'", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.responseType = "text";
                xhr.onreadystatechange = function(){
                  if(this.readyState === XMLHttpRequest.DONE){
                    expect(this.response).to.be("{\"result\":\"normal\"}");
                    done();
                  }
                };
                xhr.send();
              });
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
              it("does nothing when removing unregistered event listener2", function(){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.addEventListener("loadstart", function(){});
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
                  expect(this.status).to.be(0);
                  done();
                });
                xhr.open("GET", timeoutApiResponseUrl);
                xhr.send();
              });
              it("ontimeout function is called", function(done){
                var xhr = new XMLHttpRequest();
                xhr.timeout = 1000;
                xhr.ontimeout = function(){
                  expect(this.status).to.be(0);
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
      })
    };
    checkXhrBehavior(false);
    checkXhrBehavior(true);
    
    describe("with hook", function(){
      before(function(){
        fetchXhrHook.clearAll();
        fetchXhrHook.enable();
      });
      
      beforeEach(function(){
        fetchXhrHook.clearAll();
      });
      
      describe("hook request", function(){
        describe("Access to url which requires Authorization header", function(){
          it("status is 403 unauthorized if no authorization header is appended", function(done){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(this.status).to.be(401);
                done();
              }
            };
            xhr.send();
          });
          it("status is 200 OK if authorization header is appended by hook script", function(done){
            fetchXhrHook.onRequest(function(req){
              this.setRequestHeader("Authorization", "test-authorization");
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(this.status).to.be(200);
                done();
              }
            };
            xhr.send();
          });
        });
        describe("hook request and return fake response", function(){
          it("returns 200 response even if accessing url which requires Authroization header", function(done){
            this.timeout(10000);
            
            fetchXhrHook.onRequest(function(req, cb){
              cb({
                status: 200,
                text: "it's dummy",
                data: "it's dummy",
              });
            });
            
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(this.status).to.be(200);
                done();
              }
            };
            xhr.send();
          });
          it("event listeners are called when it is replaced with fake response ", function(done){
            fetchXhrHook.onRequest(function(req, cb){
              cb({
                status: 200,
                text: "it's dummy",
                data: "it's dummy",
              });
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            
            var calledFunctions = [];
            var assertOnCall = function(name){ return function(){calledFunctions.push(name)}; };
            xhr.onloadstart = assertOnCall("onloadstart");
            xhr.onload = assertOnCall("onload");
            xhr.onloadend = assertOnCall("onloadend");
            xhr.addEventListener("loadstart", assertOnCall("onloadstartListener"));
            xhr.addEventListener("load", assertOnCall("onloadListener"));
            xhr.addEventListener("loadend", assertOnCall("onloadendListener"));
            
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.HEADERS_RECEIVED){
                calledFunctions.push("HEADERS_RECEIVED");
              }
              if(this.readyState === xhr.LOADING){
                calledFunctions.push("LOADING");
              }
              if(this.readyState === xhr.DONE){
                expect(calledFunctions.filter(f => f === "HEADERS_RECEIVED")).to.have.length(1);
                expect(calledFunctions.filter(f => f === "LOADING")).to.have.length(1);
                expect(calledFunctions.filter(f => f === "onloadstart")).to.have.length(1);
                expect(calledFunctions.filter(f => f === "onloadstartListener")).to.have.length(1);
              }
            };
            
            xhr.addEventListener("loadend", function(){
              expect(calledFunctions.filter(f => f === "onload")).to.have.length(1);
              expect(calledFunctions.filter(f => f === "onloadend")).to.have.length(1);
              expect(calledFunctions.filter(f => f === "onloadListener")).to.have.length(1);
              expect(calledFunctions.filter(f => f === "onloadendListener")).to.have.length(1);
              done();
            });
            
            xhr.send();
          });
          it("does not actually send xhr request until calling xhr callback", function(done){
            this.timeout(10000);
            
            fetchXhrHook.onRequest(function(req, cb){
              window.setTimeout(function(){
                cb({
                  status: 200,
                  text: "it's dummy",
                  data: "it's dummy",
                });
              }, 3000);
            });
  
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(xhr.status).to.be(200);
                done();
              }
            };
            xhr.send();
          });
          it("returns fake headers by callback function", function(done){
            fetchXhrHook.onRequest(function(req, cb){
              cb.moveToHeaderReceived({
                headers: {"test-header": "aaa"},
              });
              cb.moveToLoading({
                headers: {"test-header2": "bbb"},
              });
              cb({
                status: 200,
                text: "it's dummy",
                data: "it's dummy",
              });
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.HEADERS_RECEIVED){
                expect(xhr.getResponseHeader("test-header")).to.be("aaa");
              }
              if(this.readyState === xhr.LOADING){
                expect(xhr.getResponseHeader("test-header")).to.be(null);
                expect(xhr.getResponseHeader("test-header2")).to.be("bbb");
              }
              if(this.readyState === xhr.DONE){
                expect(xhr.status).to.be(200);
                done();
              }
            };
            xhr.send();
          });
          it("returns no headers by callback functions after readyState is DONE", function(done){
            fetchXhrHook.onRequest(function(req, cb){
              cb({
                status: 200,
                text: "it's dummy",
                data: "it's dummy",
              });
              cb.moveToHeaderReceived({
                headers: {"test-header": "aaa"},
              });
              cb.moveToLoading({
                headers: {"test-header2": "bbb"},
              });
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.HEADERS_RECEIVED){
                expect(xhr.getResponseHeader("test-header")).to.be(null);
              }
              if(this.readyState === xhr.LOADING){
                expect(xhr.getResponseHeader("test-header")).to.be(null);
              }
              if(this.readyState === xhr.DONE){
                expect(xhr.status).to.be(200);
                done();
              }
            };
            xhr.send();
          });
          it("calls onabort event listener abort when response is paused in callback function", function(done){
            this.timeout(10000);
            
            fetchXhrHook.onRequest(function(req, cb){
              window.setTimeout(function(){
                cb({
                  status: 200,
                  text: "it's dummy",
                  data: "it's dummy",
                });
              }, 2000);
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onabort = function(){
              expect(this.status).to.be(0);
              done();
            }
            xhr.send();
            xhr.abort();
          });
          it("does not send fake response when response object is not supplied to callback function", function(done){
            this.timeout(10000);
  
            fetchXhrHook.onRequest(function(req, cb){
              cb(false);
            });
    
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(this.status).to.be(401);
                done();
              }
            }
            xhr.send();
          });
        });
        describe("hook response", function(){
          it("replace failed 401 response to 200 response", function(done){
            fetchXhrHook.onResponse(function(req, res){
              res.status = 200;
              res.statusText = "OK";
              res.response = "it's dummy but it's OK";
              res.responseText = "it's dummy but it's OK";
            });
  
            var xhr = new XMLHttpRequest();
            xhr.open("GET", authRequiredResponseUrl);
            xhr.onreadystatechange = function(){
              if(this.readyState === xhr.DONE){
                expect(this.status).to.be(200);
                expect(this.response).to.be("it's dummy but it's OK");
                done();
              }
            };
            xhr.send();
          });
        });
      });
    });
  });
});
