var describe_xspy = window.__test__.describe_xspy;
var describe_XMLHttpRequest = window.__test__.describe_XMLHttpRequest;
var describe_fetch = window.__test__.describe_fetch;

function dispatchTest(test_description){
  if(typeof test_description === "function"){
    test_description();
  }
}

describe("xspy", function(){
  dispatchTest(describe_xspy);
  dispatchTest(describe_XMLHttpRequest);
  dispatchTest(describe_fetch);
});
