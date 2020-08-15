var isIE = window.__test__.isIE;
var normalApiResponseUrl = window.__test__.normalApiResponseUrl;
var timeoutApiResponseUrl = window.__test__.timeoutApiResponseUrl;
var invalidXMLApiResponseUrl = window.__test__.invalidXMLApiResponseUrl;
var authRequiredResponseUrl = window.__test__.authRequiredResponseUrl;
var validXMLUrl = window.__test__.validXMLUrl;
var postUrl = window.__test__.postUrl;

var describe_XMLHttpRequest = function(){
  return describe("spy XMLHttpRequest", function(){
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
                try{
                  expect(this.readyState).to.be(this.OPENED);
                  done();
                }
                catch(e){
                  done(e);
                }
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
                // It's so strange but this test sometimes takes a bit more than 2000ms (mocha's default timeout)
                // This case is limited for chromium browser from `puppeteer` package.
                // @TODO Investigate why puppeteer's chromium takes over 2000ms to complete this test case.
                this.timeout(4000);
              
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
                    try{
                      expect(this.response).to.be("{\"result\":\"normal\"}");
                      expect(this.responseText).to.be("{\"result\":\"normal\"}");
                      done();
                    }
                    catch(e){
                      done(e);
                    }
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
                    try{
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
                    catch(e){
                      done(e);
                    }
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
                it("should fire onloadstart event listener. (Skipping as IE <= 9 does not support loadstart event)", function(){
                  this.skip();
                });
                it("should fire onloadstart function. (Skipping as IE <= 9 does not support loadstart event)", function(){
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
                    try{
                      expect(this.getAllResponseHeaders()).to.not.empty();
                      done();
                    }
                    catch(e){
                      done(e);
                    }
                  }
                };
                xhr.send();
              });
              it("getResponseHeader returns non-empty string", function(done){
                var xhr = new XMLHttpRequest();
                xhr.open("GET", normalApiResponseUrl);
                xhr.onreadystatechange = function(){
                  if(this.readyState === XMLHttpRequest.DONE){
                    try{
                      expect(this.getResponseHeader("content-type")).to.not.empty();
                      done();
                    }
                    catch(e){
                      done(e);
                    }
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
                  try{
                    expect(this.status).to.be(0);
                    done();
                  }
                  catch(e){
                    done(e);
                  }
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
                  try{
                    expect(this.status).to.be(0);
                    done();
                  }
                  catch(e){
                    done(e);
                  }
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
                  try{
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
                  }
                  catch(e){
                    done(e);
                  }
                });
                xhr.open("GET", timeoutApiResponseUrl);
                xhr.send();
                xhr.abort();
              });
              it("onabort function is called", function(done){
                var xhr = new XMLHttpRequest();
                xhr.onabort = function(){
                  try{
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
                  }
                  catch(e){
                    done(e);
                  }
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
              try{
                expect(this.status).to.be(200);
                expect(this.response).to.be("it's dummy");
                done();
              }
              catch(e){
                done(e);
              }
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
              try{
                expect(calledFunctions.filter(function(f){ return f === "HEADERS_RECEIVED"; })).to.have.length(1);
                expect(calledFunctions.filter(function(f){ return f === "LOADING"; })).to.have.length(1);
                expect(calledFunctions.filter(function(f){ return f === "onloadstart"; })).to.have.length(1);
                expect(calledFunctions.filter(function(f){ return f === "onloadstartListener"; })).to.have.length(1);
              }
              catch(e){
                done(e);
              }
            }
          };
        
          xhr.addEventListener("loadend", function(){
            try{
              expect(calledFunctions.filter(function(f){ return f === "onload"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "onloadend"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "onloadListener"; })).to.have.length(1);
              expect(calledFunctions.filter(function(f){ return f === "onloadendListener"; })).to.have.length(1);
              done();
            }
            catch(e){
              done(e);
            }
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
              try{
                expect(xhr.status).to.be(200);
                expect(this.response).to.be("it's dummy");
                done();
              }
              catch(e){
                done(e);
              }
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
            try{
              expect(this.status).to.be(0);
              done();
            }
            catch(e){
              done(e);
            }
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
              try{
                expect(this.status).to.be(200);
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
              try{
                expect(this.status).to.be(200);
                expect(this.response).to.be("it's dummy but it's OK");
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
              try{
                expect(this.status).to.be(200);
                expect(this.response).to.be("it's dummy but it's OK");
                expect(Date.now() - start).to.be.greaterThan(3000);
                done();
              }
              catch(e){
                done(e);
              }
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
              try{
                expect(this.status).to.be(200);
                done();
              }
              catch(e){
                done(e);
              }
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
};

window.__test__.describe_XMLHttpRequest = describe_XMLHttpRequest;
