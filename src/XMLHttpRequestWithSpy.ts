import {RequestCallback, TRequest, TResponse} from "./XMLHttpRequestWithSpy.type";
import {IEVersion, makeProgressEvent, toHeaderMap, toHeaderString} from "./XMLHttpRequestWithSpy.lib";
import {Spy} from "./Spy";

export class XMLHttpRequestWithSpy implements XMLHttpRequest {
  public readonly UNSENT: number = 0;
  public readonly OPENED: number = 1;
  public readonly HEADERS_RECEIVED: number = 2;
  public readonly LOADING: number = 3;
  public readonly DONE: number = 4;
  
  private _xhr = new Spy.OriginalXHR();
  private _listeners: {[type: string]: Array<(this: XMLHttpRequest, ev: Event|ProgressEvent<XMLHttpRequestEventTarget>) => unknown>} = {};
  private _readyState: number = 0;
  private _isAborted: boolean = false;
  private _hasError: boolean|null = null;
  private _transitioning: boolean|null = null;
  private _request: TRequest = XMLHttpRequestWithSpy._createRequest(this._xhr);
  private _response: TResponse = XMLHttpRequestWithSpy._createResponse();
  
  public readyState = 0;
  public status = 0;
  public statusText = "";
  public timeout: number = 0;
  public readonly upload = new XMLHttpRequestUpload();
  
  public response: Document|string|null = "";
  public responseText: string = "";
  public responseType: XMLHttpRequestResponseType = "";
  public responseURL: string = "";
  public responseXML: Document | null = null;
  public withCredentials: boolean = false;
  
  public onreadystatechange: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onabort: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onerror: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onloadstart: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onload: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onloadend: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public ontimeout: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  public onprogress: ((this: XMLHttpRequest, ev: Event) => unknown) | null = null;
  
  constructor() {
    this._init();
  }
  
  private _init(){
    const addEventListener = (name: "error"|"timeout"|"abort"|"progress") => {
      this.addEventListener(name, this._onError);
    }
    addEventListener("error");
    addEventListener("timeout");
    addEventListener("abort");
    addEventListener("progress");
    
    this._xhr.onreadystatechange = () => {
      const realReadyState = this._xhr.readyState;
      if(realReadyState === this.HEADERS_RECEIVED){
        this._loadHeadersToResponse();
      }
      else if(realReadyState === this.DONE){
        this._transitioning = false;
        this._loadHeadersToResponse();
        this._loadBodyToResponse();
      }
      
      this._runUntil(realReadyState);
    };
  }
  
  public addEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: XMLHttpRequest, ev: Event|ProgressEvent<XMLHttpRequestEventTarget>) => unknown,
    options?: boolean | AddEventListenerOptions
  ){
    if(!this._listeners[type]){
      this._listeners[type] = [];
    }
    
    this._listeners[type].push(listener);
  }
  
  public removeEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: XMLHttpRequest, ev: Event|ProgressEvent<XMLHttpRequestEventTarget>) => any,
    options?: boolean | EventListenerOptions
  ){
    if(!this._listeners[type]){
      return;
    }
    
    const index = this._listeners[type].findIndex(l => l === listener);
    if(index < 0){
      return;
    }
    
    this._listeners[type].splice(index, 1);
  }
  
  public dispatchEvent(event: Event|ProgressEvent<XMLHttpRequestEventTarget>){
    const onHandlerPropName = "on" + event.type;
    if(onHandlerPropName === "onabort"
      || onHandlerPropName === "onerror"
      || onHandlerPropName === "onload"
      || onHandlerPropName === "onloadend"
      || onHandlerPropName === "onloadstart"
      || onHandlerPropName === "onprogress"
      || onHandlerPropName === "ontimeout"
    ){
      const handler = this[onHandlerPropName];
      if(handler){
        handler.call(this, event as ProgressEvent<XMLHttpRequestEventTarget>);
      }
    }
    else if(onHandlerPropName === "onreadystatechange"){
      const handler = this[onHandlerPropName];
      if(handler){
        handler.call(this, event as Event);
      }
    }
    
    const listeners = this._listeners[event.type];
    for(let i=0;i<listeners.length;i++){
      const l = listeners[i];
      l.call(this, event);
    }
    return true;
  }
  
  public overrideMimeType(mime: string) {
    return this._xhr.overrideMimeType.call(this._xhr, mime);
  }
  
  public open(method: string, url: string, async?: boolean, username?: string|null, password?: string|null){
    if(arguments.length < 2){
      throw new TypeError("XMLHttpRequest.open: " + arguments.length + " is not a valid argument count for any overload");
    }
    
    this._readyState = 0;
    this._hasError = false;
    this._isAborted = false;
    this._transitioning = false;
    
    this._request = {
      ...XMLHttpRequestWithSpy._createRequest(this._xhr),
      headers: {},
      status: 0,
      method,
      url,
      async: async !== false,
      username,
      password,
    };
    
    this._response = {
      ...XMLHttpRequestWithSpy._createResponse(),
      headers: {},
    };
    
    this._runUntil(this.OPENED);
  }
  
  public send(body?: Document | BodyInit | null) {
    if(this._readyState !== this.OPENED){
      throw new DOMException("XMLHttpRequest state must be OPENED");
    }
    
    this._request.responseType = this.responseType;
    this._request.timeout = this.timeout;
    this._request.withCredentials = this.withCredentials;
    this._request.body = body;
    
    const listeners = Spy.getRequestListeners();
    
    const requestCallback: RequestCallback = this._createRequestCallback();
    
    try{
      for(let i=0;i<listeners.length;i++){
        const l = listeners[i];
        // l: (request) => unknown
        if(l.length < 2){
          l.call(this, this._request);
        }
        // l: (request, callback) => unknown
        else{
          l.call(this, this._request, requestCallback);
        }
      }
    }
    catch(e){
      console.warn("XMLHttpRequest: Exception in request handler", e);
    }
    
    // When requestCallback is used, readystate is automatically move forward to 'DONE'
    // and produce dummy response.
    if(this._readyState === this.DONE){
      return;
    }
  
    this._xhr.onabort = this.onabort;
    this._xhr.onerror = this.onerror;
    this._xhr.ontimeout = this.ontimeout;
    this._xhr.onprogress = this.onprogress;
    if(this.upload){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this._xhr.upload = this.upload;
      this._request.upload = this.upload;
    }
  
    this._transitioning = true;
  
    this._xhr.open(
      this._request.method,
      this._request.url,
      this._request.async ?? true,
      this._request.username,
      this._request.password
    );
  
    this._xhr.responseType = this.responseType;
    this._xhr.timeout = this.timeout;
    this._xhr.withCredentials = this.withCredentials;
  
    const headerMap = this._request.headers;
    for(const headerName in headerMap){
      if(!Object.prototype.hasOwnProperty.call(headerMap, headerName)){
        continue;
      }
      
      const headerValue = headerMap[headerName];
      if(headerValue){
        this._xhr.setRequestHeader(headerName, headerValue);
      }
    }
  
    this._xhr.send(this._request.body);
  }
  
  public setRequestHeader(name: string, value: string) {
    if(this.readyState !== this.OPENED){
      throw new DOMException("XMLHttpRequest state must be OPENED");
    }
    
    const lowerName = name.toLowerCase();
    if(this._request.headers[lowerName]){
      value = this._request.headers[lowerName] + ", " + value;
    }
    
    this._request.headers[lowerName] = value;
  }
  
  public getResponseHeader(name: string): string | null {
    const lowerHeaderName = name.toLowerCase();
    return this._response.headers[lowerHeaderName];
  }
  
  public getAllResponseHeaders(): string {
    return toHeaderString(this._response.headers);
  }
  
  public abort() {
    this._isAborted = true;
    if(this._transitioning){
      this._xhr.abort();
    }
    else{
      this.dispatchEvent(makeProgressEvent("abort", 0));
    }
    
    this.status = 0;
  }
  
  private static _createRequest(xhr: XMLHttpRequest){
    return {
      xhr,
      headers: {},
      status: 0,
      method: "GET",
      url: "",
      async: true,
      timeout: 0,
    };
  }
  
  private static _createResponse(){
    return {
      status: 0,
      statusText: "",
      finalUrl: "",
      headers: {},
    };
  }
  
  private _createRequestCallback(): RequestCallback {
    type RequestCallbackOnlyWithDefaultFunc = {
      (dummyResponse: TResponse): unknown;
      moveToHeaderReceived?: (dummyResponse: TResponse) => void;
      moveToLoading?: (dummyResponse: TResponse) => void;
    };
    
    const cb: RequestCallbackOnlyWithDefaultFunc = (response: TResponse) => {
      if(!response || typeof response !== "object"){
        return;
      }
  
      this._response = {
        ...this._response,
        ...response,
      };
  
      this._runUntil(this.DONE);
    };
    
    const moveToHeaderReceived = (response: TResponse) => {
      if(this.readyState >= this.HEADERS_RECEIVED){
        return;
      }
      this._response = {
        ...this._response,
        ...response,
      };
      this._runUntil(this.HEADERS_RECEIVED);
    };
    
    const moveToLoading = (response: TResponse) => {
      if(this.readyState >= this.LOADING){
        return;
      }
      this._response = {
        ...this._response,
        ...response,
      };
      this._runUntil(this.LOADING);
    };
    
    cb.moveToHeaderReceived = moveToHeaderReceived;
    cb.moveToLoading = moveToLoading;
    
    return cb as RequestCallback;
  }
  
  private _loadHeadersToResponse(){
    this._response.status = this._xhr.status;
    if(isNaN(IEVersion) || IEVersion >= 10){
      this._response.statusText = this._xhr.statusText;
    }
  
    if(this._isAborted){
      return;
    }
    
    const responseHeaders = this._xhr.getAllResponseHeaders();
    const headerMap = toHeaderMap(responseHeaders);
  
    const keys = Object.keys(headerMap);
    for(let i=0;i<keys.length;i++){
      const key = keys[i];
      const value = headerMap[key];
      if(!this._response.headers[key]){
        this._response.headers[key] = value;
      }
    }
  }
  
  private _loadBodyToResponse(){
    if(!this._xhr.responseType || this._xhr.responseType === "text"){
      this._response.text = this._xhr.responseText;
      this._response.data = this._xhr.responseText;
      this._response.xml = this._xhr.responseXML;
    }
    else if(this._xhr.responseType === "document"){
      this._response.xml = this._xhr.responseXML;
      this._response.data = this._xhr.responseXML;
    }
    else{
      this._response.data = this._xhr.response;
    }
    
    if("responseURL" in this._xhr){
      this._response.finalUrl = this._xhr.responseURL;
    }
  }
  
  private _syncResponseHeader(){
    this.status = this._response.status;
    this.statusText = this._response.statusText;
  }
  
  private _syncResponseBody(){
    if("text" in this._response){
      this.responseText = this._response.text || "";
    }
    if("xml" in this._response){
      this.responseXML = this._response.xml || null;
    }
    if("data" in this._response){
      this.response = this._response.data || null;
    }
    if("finalUrl" in this._response){
      this.responseURL = this._response.finalUrl;
    }
  }
  
  private _onError(){
    this._hasError = true;
    this._readyState = this.UNSENT;
    this.readyState = this.UNSENT;
  }
  
  private _onProgress(){
    if(this._readyState < this.LOADING){
      this._runUntil(this.LOADING);
    }
    else{
      this.dispatchEvent(new Event("readystatechange"));
    }
  }
  
  private _triggerStateAction(){
    const readyStateChangeEvent = new Event("readystatechange")
    
    if(this._readyState === this.OPENED){
      this.dispatchEvent(readyStateChangeEvent);
      this.dispatchEvent(makeProgressEvent("loadstart", 0));
    }
    else if(this._readyState === this.HEADERS_RECEIVED){
      this._syncResponseHeader();
      this.dispatchEvent(readyStateChangeEvent);
    }
    else if(this._readyState === this.LOADING){
      this._syncResponseHeader();
      this.dispatchEvent(readyStateChangeEvent);
    }
    else if(this._readyState === this.DONE){
      this._syncResponseHeader();
      this._syncResponseBody();
      
      const listeners = Spy.getResponseListeners();
      for(let i=0;i<listeners.length;i++){
        const l = listeners[i];
        l.call(this._xhr, this._request, this._response);
      }
  
      this.dispatchEvent(readyStateChangeEvent);
      
      const emitLoadEvent = () => {
        if(!this._hasError){
          this.dispatchEvent(makeProgressEvent("load", 0));
        }
        this.dispatchEvent(makeProgressEvent("loadend", 0));
      };
      
      if(this._request.async === false){
        emitLoadEvent();
      }
      else{
        window.setTimeout(emitLoadEvent, 0);
      }
    }
  }
  
  private _runUntil(state: number){
    while(this._readyState < state && this._readyState < this.DONE){
      this._readyState++;
      this.readyState = this._readyState;
    
      this._triggerStateAction();
    }
  }
}
