var isIE = window.__test__.isIE;
var normalApiResponseUrl = window.__test__.normalApiResponseUrl;
var timeoutApiResponseUrl = window.__test__.timeoutApiResponseUrl;
var invalidXMLApiResponseUrl = window.__test__.invalidXMLApiResponseUrl;
var authRequiredResponseUrl = window.__test__.authRequiredResponseUrl;
var validXMLUrl = window.__test__.validXMLUrl;
var postUrl = window.__test__.postUrl;

var describe_fetch = function(){
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
};

window.__test__.describe_fetch = describe_fetch;
