var describe_xspy = function(){
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
};

window.__test__.describe_xspy = describe_xspy;
