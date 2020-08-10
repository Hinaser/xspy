var baseApiUrl  = testConfig.protocol + "://" + testConfig.host + ":" + testConfig.port;
var normalApiResponseUrl = baseApiUrl + testConfig.path.api.normal;
var timeoutApiResponseUrl = baseApiUrl + testConfig.path.api.timeout;
var invalidXMLApiResponseUrl = baseApiUrl + testConfig.path.api.invalidXml;
var authRequiredResponseUrl = baseApiUrl + testConfig.path.api.auth;
var validXMLUrl = baseApiUrl + testConfig.path.api.validXml;
var postUrl = baseApiUrl + testConfig.path.api.post;

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


describe("xspy", function(){
  describe("xspy", function(){
    it("returns true if spy is applied", function(){
      xspy.enable();
      expect(xspy.isEnabled()).to.be(true);
    });
    it("returns empty array if onRequest is not called", function(){
      expect(xspy.getRequestListeners()).to.have.length(0);
    });
    it("returns appended request listener", function(){
      var listener = function(){};
      xspy.onRequest(listener);
      expect(xspy.getRequestListeners()).to.have.length(1);
      xspy.offRequest(listener);
      expect(xspy.getRequestListeners()).to.have.length(0);
    });
    it("a request listener already appended is not registered again", function(){
      var listener = function(){};
      xspy.onRequest(listener);
      expect(xspy.getRequestListeners()).to.have.length(1);
      xspy.onRequest(listener);
      expect(xspy.getRequestListeners()).to.have.length(1);
      xspy.clearRequestHandler();
    });
    it("returns empty array when clearRequestHandler() is called", function(){
      xspy.onRequest(function(){}, 0);
      expect(xspy.getRequestListeners()).to.have.length(1);
      xspy.clearRequestHandler();
      expect(xspy.getRequestListeners()).to.have.length(0);
    });
    it("returns empty array if onResponse is not called", function(){
      expect(xspy.getResponseListeners()).to.have.length(0);
    });
    it("returns appended response listener", function(){
      var listener = function(){};
      xspy.onResponse(listener);
      expect(xspy.getResponseListeners()).to.have.length(1);
      xspy.offResponse(listener);
      expect(xspy.getResponseListeners()).to.have.length(0);
    });
    it("a response listener already appended is not registered again", function(){
      var listener = function(){};
      xspy.onResponse(listener);
      expect(xspy.getResponseListeners()).to.have.length(1);
      xspy.onResponse(listener);
      expect(xspy.getResponseListeners()).to.have.length(1);
      xspy.clearResponseHandler();
    });
    it("returns empty array when clearResponseHandler() is called", function(){
      xspy.onResponse(function(){}, 0);
      expect(xspy.getResponseListeners()).to.have.length(1);
      xspy.clearResponseHandler();
      expect(xspy.getResponseListeners()).to.have.length(0);
    });
    it("returns empty request/response array after clearAll() is called", function(){
      xspy.onRequest(function(){}, 0);
      xspy.onResponse(function(){}, 0);
      expect(xspy.getRequestListeners()).to.have.length(1);
      expect(xspy.getResponseListeners()).to.have.length(1);
      xspy.clearAll();
      expect(xspy.getRequestListeners()).to.have.length(0);
      expect(xspy.getResponseListeners()).to.have.length(0);
    });
  });
  describe("spy XMLHttpRequest", function(){
    var checkXhrBehavior = function(useSpy){
      describe(useSpy ? "spied XMLHttpRequest (xspy enabled)" : "original XMLHttpRequest (xspy disabled)", function(){
        before(function(){
          if(useSpy){
            xspy.enable();
          }
          else{
            xspy.disable();
          }
        });
        describe("object structure of spied XMLHttpRequest", function(){
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
              if(!isIE() || isIE(">=", 10)){
                expect(xhr.getAllResponseHeaders()).to.empty();
              }
              // IEVersion <= 9
              else{
                expect(function(){ xhr.getAllResponseHeaders() }).to.throwError();
              }
            });
            it("getResponseHeader returns null", function(){
              var xhr = new XMLHttpRequest();
              if(!isIE() || isIE(">=", 10)){
                expect(xhr.getResponseHeader("content-type")).to.be(null);
              }
              // IEVersion <= 9
              else{
                expect(function(){ xhr.getResponseHeader("content-type") }).to.throwError();
              }
            });
            it("throws TypeError when calling `dispatchEvent` with non-object argument", function(){
              var xhr = new XMLHttpRequest();
              expect(function(){
                xhr.dispatchEvent("unknown event aaa");
              }).to.throwError();
            });
            if(!isIE()){
              it("does nothing when calling `dispatchEvent` with unknown event", function(){
                var xhr = new XMLHttpRequest();
                expect(function(){
                  ev = new Event("unknown event aaa");
                  xhr.dispatchEvent(ev);
                }).not.to.throwError();
              });
            }
            else{
              it("does nothing when calling `dispatchEvent` with unknown event. (Skipping as IE does not support custom event)", function(){
                this.skip();
              });
            }
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
            describe("general", function(){
              it("should throw an Error on sent if it is not yet OPENED", function(){
                var xhr = new XMLHttpRequest();
                expect(function(){xhr.send()}).to.throwError();
              });
              it("onreadystatechange event is triggered in order", function(done){
                var xhr = new XMLHttpRequest();
                var expectedReadyState;
                var xhrOpenCalled = false;
    
                expectedReadyState = XMLHttpRequest.OPENED;
                xhr.onreadystatechange = function(){
                  try{
                    if(!isIE()){
                      expect(this.readyState).to.be(expectedReadyState++);
                    }
                      // When IE, it seems xhr.onreadystatechange() will be called twice with readyState = "OPENED".
                    // First after xhr.open() is executed, second xhr.send() is executed.
                    else if(!xspy.isEnabled()){
                      expect(this.readyState).to.be(expectedReadyState++);
                      if(!xhrOpenCalled){
                        expectedReadyState--;
                      }
                    }
                    if(this.readyState === XMLHttpRequest.DONE){
                      done();
                    }
                  }
                  catch(e){
                    done(e);
                  }
                };
                xhr.open("GET", normalApiResponseUrl);
                xhrOpenCalled = true;
                xhr.send();
              });
              it("synchronously gets response when async option is set to false", function(){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl, false);
                xhr.send();
                expect(xhr.status).to.be(200);
              });
              it("can post and receive json object", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("POST", postUrl);
                var body = JSON.stringify({test: 1});
                xhr.setRequestHeader("content-type", "application/json");
                xhr.responseType = "json";
                xhr.addEventListener("load", function(){
                  try{
                    expect(this.status).to.be(200);
                    // IE does not support responseType:json
                    if(!isIE()){
                      expect(this.response).to.have.property("test");
                      expect(this.response.test).to.be(true);
                    }
                    else if(isIE(">=", 10)){
                      expect(this.response).to.be("{\"test\":true}");
                      expect(this.responseText).to.be("{\"test\":true}");
                    }
                    // IE <= 9 does not support responseType at all.
                    else{
                      expect(this.response).to.be(undefined);
                    }
                    done();
                  }
                  catch(e){
                    done(e);
                  }
                });
                xhr.send(body);
              });
            });
            describe("responseType", function(){
              if(isIE("<=", 9)){
                it("IE <= 9 does not support responseType at all. Skipping.", function(){
                  this.skip();
                });
                return;
              }
              
              it("returns json response when responseType is set to 'json'", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.responseType = "json";
                xhr.onreadystatechange = function(){
                  if(this.readyState === XMLHttpRequest.DONE){
                    try{
                      // IE does not support responseType:json so only test below if browser is not IE.
                      if(!isIE()){
                        expect(this.response).to.have.property("result");
                        expect(function(){
                          var test = this.responseText; // expected to throw InvalidStateError
                        }.bind(this)).to.throwError();
                        expect(function(){
                          var test = this.responseXML; // expected to throw InvalidStateError
                        }.bind(this)).to.throwError();
                      }
                      // IE >= 10
                      else{
                        expect(this.response).to.be("{\"result\":\"normal\"}");
                        expect(this.responseText).to.be("{\"result\":\"normal\"}");
                      }
                      done();
                    }
                    catch(e){
                      done(e);
                    }
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
                    expect(this.responseText).to.be("{\"result\":\"normal\"}");
                    done();
                  }
                };
                xhr.send();
              });
              it("returns document response when responseType is set to 'document'", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", validXMLUrl);
                xhr.responseType = "document";
                xhr.onreadystatechange = function(){
                  if(this.readyState === XMLHttpRequest.DONE){
                    if(isIE("<=", 10)){
                      expect(this.response instanceof Document).to.be(true);
                      expect(this.responseXML instanceof Document).to.be(true);
                    }
                    else{
                      expect(this.response instanceof XMLDocument).to.be(true);
                      expect(this.responseXML instanceof XMLDocument).to.be(true);
                    }
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
              // IE <= 9 does not support `loadstart` event.
              if(isIE("<=", 9)){
                it("should fire onloadstart event listener. (Skipping as IE <= 9 does not support loadstart event)", function(done){
                  this.skip();
                });
                it("should fire onloadstart function. (Skipping as IE <= 9 does not support loadstart event)", function(done){
                  this.skip();
                });
              }
              else{
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
              }
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
              if(isIE("<=", 9)){
                it("should fire onloadend event listener. (Skipping as IE <= 9 does not support loadend event)", function(){
                  this.skip();
                });
                it("should fire onloadend function. (Skipping as IE <= 9 does not support loadend event)", function(){
                  this.skip();
                });
              }
              else{
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
              }
              it("should fire multiple onload event listener", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                var counter = 0;
                xhr.addEventListener("load", function(){
                  counter++;
                  if(counter > 1){
                    done();
                  }
                });
                xhr.addEventListener("load", function(){
                  counter++;
                  if(counter > 1){
                    done();
                  }
                });
                xhr.send();
              });
              it("should not fire removed onload event listener", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                var removingListener = function(){
                  done(new Error("Should not be called"));
                };
                xhr.addEventListener("load", removingListener);
                xhr.addEventListener("load", function(){
                  done();
                });
                xhr.removeEventListener("load", removingListener);
                xhr.send();
              });
              it("does nothing when removing unregistered event listener", function(){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.removeEventListener("load", function(){
                  throw new Error("Never be called");
                });
                xhr.send();
              });
              it("does nothing when removing unregistered event listener2", function(){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.addEventListener("load", function(){});
                xhr.removeEventListener("load", function(){
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
                    try{
                      if(isIE("<=", 9)){
                        expect(this.getResponseHeader("never-existing-header-name")).to.empty();
                      }
                      else{
                        expect(this.getResponseHeader("never-existing-header-name")).to.be(null);
                      }
                      done();
                    }
                    catch(e){
                      done(e);
                    }
                  }
                };
                xhr.send();
              });
              if(isIE("<=", 10)){
                // IE 10 or older does not implement xhr.overrideMimeType();
                it("does not throws error when receiving invalid xml with 'content-type: text/xml' after override mime type (Skip this because IE <= 10 does not implement overrideMimeType)", function(){
                  this.skip();
                });
              }
              else{
                it("does not throws error when receiving invalid xml with 'content-type: text/xml' after override mime type", function(){
                  var xhr = new XMLHttpRequest();
                  xhr.open("GET", invalidXMLApiResponseUrl);
                  xhr.overrideMimeType("text/plain");
                  expect(function(){xhr.send()}).not.to.throwError();
                });
              }
            });
            describe("timeout", function(){
              if(isIE("<=", 9)){
                it("ontimeout event listener/function is called. (Skipping as IE <= 9 does not support timeout event)", function(){
                  this.skip();
                });
                return;
              }
              
              it("ontimeout event listener is called", function(done){
                var xhr = new XMLHttpRequest();
                // When IE, xhr.timeout can be assigned after open() and before send().
                if(!isIE()){
                  xhr.timeout = 1000;
                }
                xhr.addEventListener("timeout", function(){
                  expect(this.status).to.be(0);
                  done();
                });
                xhr.open("GET", timeoutApiResponseUrl);
                if(isIE()){
                  xhr.timeout = 1000;
                }
                xhr.send();
              });
              it("ontimeout function is called", function(done){
                var xhr = new XMLHttpRequest();
                // When IE, xhr.timeout can be assigned after open() and before send().
                if(!isIE()){
                  xhr.timeout = 1000;
                }
                xhr.ontimeout = function(){
                  expect(this.status).to.be(0);
                  done();
                };
                xhr.open("GET", timeoutApiResponseUrl);
                if(isIE()){
                  xhr.timeout = 1000;
                }
                xhr.send();
              });
            });
            describe("abort", function(){
              if(isIE("<=", 9)){
                it("onabort event listener/function is called. (Skipping as IE <= 9 does not support abort event)", function(){
                  this.skip();
                });
                return;
              }
  
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
    
    describe("with spy", function(){
      before(function(){
        xspy.clearAll();
        xspy.enable();
      });
      
      beforeEach(function(){
        xspy.clearAll();
      });
  
      describe("spy request", function(){
        it("status is 401 unauthorized if no authorization header is appended", function(done){
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              try{
                expect(this.status).to.be(401);
                done();
              }
              catch(e){
                done(e);
              }
            }
          };
          xhr.send();
        });
        it("status is 200 OK if authorization header is appended by spy script", function(done){
          xspy.onRequest(function(req){
            req.headers["Authorization"] = "test-authorization"
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
        it("status is 401 if appended valid Authorization header is removed", function(done){
          xspy.onRequest(function(req){
            req.headers = undefined;
          });
  
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.setRequestHeader("Authorization", "test-authorization");
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              try{
                expect(this.status).to.be(401);
                done();
              }
              catch(e){
                done(e);
              }
            }
          };
          xhr.send();
        });
        it("status is 200 if valid Authorization header is appended after private _request.header is set to undefined", function(done){
          xspy.onRequest(function(req){
            req.headers = undefined;
          });
          xspy.onRequest(function(req){
            this.setRequestHeader("Authorization", "test-authorization");
          });
    
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              try{
                expect(this.status).to.be(200);
                done();
              }
              catch(e){
                done(e);
              }
            }
          };
          xhr.send();
        });
      });
      describe("spy request and return fake response", function(){
        beforeEach(function(){
          xspy.clearAll();
        });
  
        it("returns 200 response even if accessing url which requires Authorization header", function(done){
          this.timeout(10000);
      
          xspy.onRequest(function(req, cb){
            cb({
              status: 200,
              body: "it's dummy",
            });
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              expect(this.status).to.be(200);
              expect(this.response).to.be("it's dummy");
              done();
            }
          };
          xhr.send();
        });
        it("event listeners are called when it is replaced with fake response ", function(done){
          xspy.onRequest(function(req, cb){
            cb({
              status: 200,
              body: "it's dummy",
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
              expect(calledFunctions.filter(function(f){ return f === "HEADERS_RECEIVED"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "LOADING"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "onloadstart"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "onloadstartListener"; })).to.have.length(1);
            }
          };
      
          xhr.addEventListener("loadend", function(){
            expect(calledFunctions.filter(function(f){ return f === "onload"; })).to.have.length(1);
            expect(calledFunctions.filter(function(f){ return f === "onloadend"; })).to.have.length(1);
            expect(calledFunctions.filter(function(f){ return f === "onloadListener"; })).to.have.length(1);
            expect(calledFunctions.filter(function(f){ return f === "onloadendListener"; })).to.have.length(1);
            done();
          });
      
          xhr.send();
        });
        it("does not actually send xhr request until calling xhr callback", function(done){
          this.timeout(10000);
      
          xspy.onRequest(function(req, cb){
            window.setTimeout(function(){
              cb({
                status: 200,
                body: "it's dummy",
              });
            }, 3000);
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              expect(xhr.status).to.be(200);
              expect(this.response).to.be("it's dummy");
              done();
            }
          };
          xhr.send();
        });
        it("returns fake headers by callback function", function(done){
          xspy.onRequest(function(req, cb){
            cb.moveToHeaderReceived({
              headers: {"test-header": "aaa"},
            });
            cb.moveToLoading({
              headers: {"test-header2": "bbb"},
            });
            cb({
              status: 200,
              body: "it's dummy",
            });
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            try{
              if(this.readyState === xhr.HEADERS_RECEIVED){
                expect(xhr.getResponseHeader("test-header")).to.be("aaa");
              }
              if(this.readyState === xhr.LOADING){
                if(isIE("<=", 9)){
                  expect(xhr.getResponseHeader("test-header")).to.be("");
                }
                else{
                  expect(xhr.getResponseHeader("test-header")).to.be(null);
                }
                expect(xhr.getResponseHeader("test-header2")).to.be("bbb");
              }
              if(this.readyState === xhr.DONE){
                expect(xhr.status).to.be(200);
                expect(this.response).to.be("it's dummy");
                done();
              }
            }
            catch(e){
              done(e);
            }
          };
          xhr.send();
        });
        it("returns no headers by callback functions after readyState is DONE", function(done){
          xspy.onRequest(function(req, cb){
            cb({
              status: 200,
              body: "it's dummy",
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
            try{
              if(this.readyState === xhr.HEADERS_RECEIVED){
                if(isIE("<=", 9)){
                  expect(xhr.getResponseHeader("test-header")).to.be("");
                }
                else{
                  expect(xhr.getResponseHeader("test-header")).to.be(null);
                }
              }
              if(this.readyState === xhr.LOADING){
                if(isIE("<=", 9)){
                  expect(xhr.getResponseHeader("test-header")).to.be("");
                }
                else{
                  expect(xhr.getResponseHeader("test-header")).to.be(null);
                }
              }
              if(this.readyState === xhr.DONE){
                expect(xhr.status).to.be(200);
                expect(this.response).to.be("it's dummy");
                done();
              }
            }
            catch(e){
              done(e);
            }
          };
          xhr.send();
        });
        it("calls onabort event listener abort when response is paused in callback function", function(done){
          this.timeout(10000);
      
          xspy.onRequest(function(req, cb){
            window.setTimeout(function(){
              cb({
                status: 200,
                body: "it's dummy",
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
      
          xspy.onRequest(function(req, cb){
            cb(false);
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              try{
                expect(this.status).to.be(401);
                done();
              }
              catch(e){
                done(e);
              }
            }
          }
          xhr.send();
        });
        it("ignores Exception in request callback in proxy", function(done){
          xspy.onRequest(function(req, cb){
            throw new Error("error");
          });
      
          xspy.onRequest(function(req, cb){
            cb({
              status: 200,
              statusText: "OK",
            });
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              expect(this.status).to.be(200);
              done();
            }
          }
          xhr.send();
        });
      });
      describe("spy response", function(){
        it("replace failed 401 response to 200 response", function(done){
          xspy.onResponse(function(req, res){
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
      describe("spy response with response callback", function(){
        it("replace failed 401 response to 200 response after waiting seconds", function(done){
          this.timeout(10000);
      
          xspy.onResponse(function(req, res, cb){
            window.setTimeout(function(){
              cb({
                status: 200,
                statusText: "OK",
                response: "it's dummy but it's OK",
                responseText: "it's dummy but it's OK",
              });
            }, 3001);
          });
      
          var start = Date.now();
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              expect(this.status).to.be(200);
              expect(this.response).to.be("it's dummy but it's OK");
              expect(Date.now() - start).to.be.greaterThan(3000);
              done();
            }
          };
          xhr.send();
        });
        it("ignores Exception in response callback in proxy", function(done){
          xspy.onResponse(function(req, res, cb){
            throw new Error("error");
          });
      
          xspy.onResponse(function(req, res, cb){
            cb({
              status: 200,
              statusText: "OK",
            });
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              expect(this.status).to.be(200);
              done();
            }
          }
          xhr.send();
        });
        it("does not return fake response when response object is not supplied to callback function", function(done){
          xspy.onResponse(function(req, res, cb){
            cb(false);
          });
      
          var xhr = new XMLHttpRequest();
          xhr.open("GET", authRequiredResponseUrl);
          xhr.onreadystatechange = function(){
            if(this.readyState === xhr.DONE){
              try{
                expect(this.status).to.be(401);
                done();
              }
              catch(e){
                done(e);
              }
            }
          }
          xhr.send();
        });
      });
    });
  });
  if(!isIE()){
    // Skip fetch test if browser is IE
    describe("spy fetch", function(){
      var checkFetchBehavior = function(useSpy){
        describe(useSpy ? "spied fetch (xspy enabled)" : "original fetch", function(){
          before(function(){
            if(useSpy){
              xspy.enable();
            }
            else{
              xspy.disable();
            }
          });
        
          describe("takes first argument as url, second as option", function(){
            it("does not throw an Error", function(done){
              window.fetch(normalApiResponseUrl, {method: "GET"})
                .then(function(res){
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can parse response as json", function(done){
              window.fetch(normalApiResponseUrl, {method: "GET"})
                .then(function(res){ return res.json(); })
                .then(function(json){
                  expect(json).to.have.property("result");
                  expect(json.result).to.be("normal");
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can parse response as text", function(done){
              window.fetch(normalApiResponseUrl, {method: "GET"})
                .then(function(res){ return res.text(); })
                .then(function(text){
                  expect(text).to.be("{\"result\":\"normal\"}");
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can send request header", function(done){
              var headers = {"Authorization": "test-authorization"};
              window.fetch(authRequiredResponseUrl, {method: "GET", headers: headers})
                .then(function(res){
                  expect(res.ok).to.be(true);
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can post json object in request body", function(done){
              var headers = {"content-type": "application/json"};
              var body = JSON.stringify({test: 1});
              window.fetch(postUrl, {method: "POST", headers: headers, body: body})
                .then(function(res){
                  expect(res.ok).to.be(true);
                  return res.json();
                })
                .then(function(json){
                  expect(json).to.have.property("test");
                  expect(json.test).to.be(true);
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
          });
          describe("takes first argument as Request", function(){
            it("does not throw an Error", function(done){
              var req = new Request(normalApiResponseUrl, {method: "GET"});
              window.fetch(req)
                .then(function(res){
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can parse response as json", function(done){
              var req = new Request(normalApiResponseUrl, {method: "GET"});
              window.fetch(req)
                .then(function(res){ return res.json(); })
                .then(function(json){
                  expect(json).to.have.property("result");
                  expect(json.result).to.be("normal");
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can parse response as text", function(done){
              var req = new Request(normalApiResponseUrl, {method: "GET"});
              window.fetch(req)
                .then(function(res){ return res.text(); })
                .then(function(text){
                  expect(text).to.be("{\"result\":\"normal\"}");
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can send request header", function(done){
              var headers = {"Authorization": "test-authorization"};
              var req = new Request(authRequiredResponseUrl, {method: "GET", headers: headers});
              window.fetch(req)
                .then(function(res){
                  expect(res.ok).to.be(true);
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
            it("can post json object in request body (Skipping because major browsers does not support sending body with Request instance for now.)", function(done){
              // Major browsers does not support sending body with Request object as of 2020/08/06.
              // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#bcd:api.Request.Request
              // So skip this test.
              this.skip();
              return;
            
              var headers = {"content-type": "application/json"};
              var body = JSON.stringify({test: 1});
              var req = new Request(postUrl, {method: "POST", headers: headers, body: body});
              window.fetch(req)
                .then(function(res){
                  expect(res.ok).to.be(true);
                  return res.json();
                })
                .then(function(json){
                  expect(json).to.have.property("test");
                  expect(json.test).to.be(true);
                  done();
                })
                .catch(function(e){
                  done(e);
                })
              ;
            });
          });
        });
      };
      checkFetchBehavior(false);
      checkFetchBehavior(true);
    
      describe("with spy", function(){
        before(function(){
          xspy.clearAll();
          xspy.enable();
        });
      
        beforeEach(function(){
          xspy.clearAll();
        });
      
        describe("Access to url which requires Authorization header", function(){
          it("status is 403 unauthorized if no authorization header is appended", function(done){
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(401);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("status is 200 OK if authorization header is appended by spy script", function(done){
            xspy.onRequest(function(req){
              req.headers["Authorization"] = "test-authorization"
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
        });
        describe("spy request and return fake response", function(){
          it("returns 200 response even if accessing url which requires Authorization header", function(done){
            xspy.onRequest(function(req, cb){
              expect(function(){
                cb.moveToHeaderReceived();
                cb.moveToLoading();
              }).not.to.throwError();
              cb({
                status: 200,
                body: "it's dummy",
              });
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                return res.text();
              })
              .then(function(text){
                expect(text).to.be("it's dummy");
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("does not actually send xhr request until calling xhr callback", function(done){
            this.timeout(4000);
            var start = Date.now();
          
            xspy.onRequest(function(req, cb){
              window.setTimeout(function(){
                cb({
                  status: 200,
                  body: "it's dummy",
                });
              }, 3001);
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(Date.now() - start).greaterThan(3000);
                expect(res.status).to.be(200);
                return res.text();
              })
              .then(function(text){
                expect(text).to.be("it's dummy");
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("returns fake headers by callback function", function(done){
            xspy.onRequest(function(req, cb){
              cb({
                status: 200,
                body: "it's dummy",
                headers: {"test-header": "aaa"},
              });
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                expect(res.headers.get("test-header")).to.be("aaa");
                return res.text();
              })
              .then(function(text){
                expect(text).to.be("it's dummy");
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("does not send fake response when response object is not supplied to callback function", function(done){
            xspy.onRequest(function(req, cb){
              cb(false);
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(401);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("ignores Exception in request callback in proxy", function(done){
            xspy.onRequest(function(req, cb){
              throw new Error("error");
            });
          
            xspy.onRequest(function(req, cb){
              cb({
                status: 200,
                statusText: "OK",
              });
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
        });
        describe("spy response", function(){
          it("replace failed 401 response to 200 response", function(done){
            xspy.onResponse(function(req, res){
              res.status = 200;
              res.statusText = "OK";
              res.body = "it's dummy but it's OK";
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                return res.text();
              })
              .then(function(text){
                expect(text).to.be("it's dummy but it's OK");
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          describe("ResponseProxy", function(){
            it("can produce error response", function(done){
              xspy.onResponse(function(req, res){
                res.status = 200;
                res.statusText = "OK";
                res.body = "ABC";
              });
            
              window.fetch(authRequiredResponseUrl, {method: "GET"})
                .then(function(res){
                  expect(res.status).to.be(200);
                  var errorResponse = res.constructor.error();
                  expect(errorResponse instanceof Response).to.be(true);
                  expect(errorResponse.type).to.be("error");
                  done();
                })
                .catch(function(e){
                  done(e);
                });
            });
            it("can produce redirected response", function(done){
              xspy.onResponse(function(req, res){
                res.status = 200;
                res.statusText = "OK";
                res.body = "ABC";
              });
            
              window.fetch(authRequiredResponseUrl, {method: "GET"})
                .then(function(res){
                  expect(res.status).to.be(200);
                  var errorResponse = res.constructor.redirect(normalApiResponseUrl, 302);
                  expect(errorResponse instanceof Response).to.be(true);
                  expect(errorResponse.status).to.be(302);
                  done();
                })
                .catch(function(e){
                  done(e);
                });
            });
            it("can turn data to arrayBuffer", function(done){
              xspy.onResponse(function(req, res){
                res.status = 200;
                res.statusText = "OK";
                res.body = "ABC";
              });
            
              window.fetch(authRequiredResponseUrl, {method: "GET"})
                .then(function(res){
                  expect(res.status).to.be(200);
                  return res.arrayBuffer();
                })
                .then(function(ab){
                  var data = new Uint8Array(ab);
                  expect(data).to.have.length(3);
                  expect(String.fromCharCode(data[0])).to.be("A");
                  expect(String.fromCharCode(data[1])).to.be("B");
                  expect(String.fromCharCode(data[2])).to.be("C");
                  done();
                })
                .catch(function(e){
                  done(e);
                });
            });
            it("can turn data to blob", function(done){
              xspy.onResponse(function(req, res){
                res.status = 200;
                res.statusText = "OK";
                res.body = "ABC";
              });
            
              window.fetch(authRequiredResponseUrl, {method: "GET"})
                .then(function(res){
                  expect(res.status).to.be(200);
                  return res.clone().blob();
                })
                .then(function(blob){
                  expect(blob instanceof Blob).to.be(true);
                  // In some cases, browser like electron does not support `blob.text()`.
                  // So if blob.text is undefined, test no more.
                  if(!blob.text){
                    return "ABC";
                  }
                  return blob.text();
                })
                .then(function(text){
                  expect(text).to.be("ABC");
                  done();
                })
                .catch(function(e){
                  done(e);
                });
            });
            it("can turn data to formData", function(done){
              xspy.onResponse(function(req, res){
                res.status = 200;
                res.statusText = "OK";
                var fd = new FormData();
                fd.append("key", "value");
                res.body = fd;
              });
            
              window.fetch(authRequiredResponseUrl, {method: "GET"})
                .then(function(res){
                  expect(res.status).to.be(200);
                  return res.formData();
                })
                .then(function(formData){
                  expect(formData instanceof FormData).to.be(true);
                  expect(formData.get("key")).to.be("value");
                  done();
                })
                .catch(function(e){
                  done(e);
                });
            });
          });
        });
        describe("spy response with response callback", function(){
          it("replace failed 401 response to 200 response after waiting seconds", function(done){
            this.timeout(10000);
          
            xspy.onResponse(function(req, res, cb){
              window.setTimeout(function(){
                cb({
                  status: 200,
                  statusText: "OK",
                  body: "it's dummy but it's OK",
                });
              }, 3001);
            });
          
            var start = Date.now();
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                expect(Date.now() - start).to.be.greaterThan(3000);
                return res.text();
              })
              .then(function(text){
                expect(text).to.be("it's dummy but it's OK");
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("ignores Exception in response callback in proxy", function(done){
            xspy.onResponse(function(req, res, cb){
              throw new Error("error");
            });
          
            xspy.onResponse(function(req, res, cb){
              cb({
                status: 200,
                statusText: "OK",
              });
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(200);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
          it("does not return fake response when response object is not supplied to callback function", function(done){
            xspy.onResponse(function(req, res, cb){
              cb(false);
            });
          
            window.fetch(authRequiredResponseUrl, {method: "GET"})
              .then(function(res){
                expect(res.status).to.be(401);
                done();
              })
              .catch(function(e){
                done(e);
              });
          });
        });
      });
    });
  }
  else {
    describe("spy fetch", function(){
      it("Skipping fetch test because IE does not implement `window.fetch`", function(){
        this.skip();
      });
    });
  }
});
