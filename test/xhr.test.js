describe("Normal", function(){
  const xhr = new XMLHttpRequest();
  
  it("has property 'onreadystatechange'", function(){
    expect(xhr).to.have.property("onreadystatechange");
  });
  
  it("has property 'readyState'", function(){
    expect(xhr).to.have.property("readyState");
  });
  
  it("has property 'status'", function(){
    expect(xhr).to.have.property("status");
  });
  
  it("status is 0", function(){
    expect(xhr.status).to.be(0);
  });
  
  it("has property 'statusText'", function(){
    expect(xhr).to.have.property("statusText");
  });
  
  it("statusText is empty", function(){
    expect(xhr.statusText).to.be.empty();
  });
  
  it("has property 'timeout'", function(){
    expect(xhr).to.have.property("timeout");
  });
  
  it("timeout is 0", function(){
    expect(xhr.timeout).to.be(0);
  });
  
  it("has property 'upload'", function(){
    expect(xhr).to.have.property("upload");
  });
  
  it("has property 'withCredentials'", function(){
    expect(xhr).to.have.property("withCredentials");
  });
  
  describe("", function(){
  });
});