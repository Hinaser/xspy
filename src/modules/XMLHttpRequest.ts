import {RequestCallback, ResponseCallback, XhrRequest, XhrResponse} from "../index.type";
import {createXHREvent, makeProgressEvent, toHeaderMap, toHeaderString, isIE} from "../index.lib";
import {XSpy} from "../XSpy";

export class XHRProxy implements XMLHttpRequest {
  static readonly UNSENT: number = 0;
  static readonly OPENED: number = 1;
  static readonly HEADERS_RECEIVED: number = 2;
  static readonly LOADING: number = 3;
  static readonly DONE: number = 4;
  
  public readonly UNSENT: number = 0;
  public readonly OPENED: number = 1;
  public readonly HEADERS_RECEIVED: number = 2;
  public readonly LOADING: number = 3;
  public readonly DONE: number = 4;
  
  private _xhr = new XSpy.OriginalXHR();
  private _listeners: {[type: string]: Array<(this: XMLHttpRequest, ev: Event|ProgressEvent<XMLHttpRequestEventTarget>) => unknown>} = {};
  private _readyState: number = 0;
  private _isAborted: boolean = false;
  private _hasError: boolean|null = null;
  private _transitioning: boolean|null = null;
  private _request: XhrRequest = XHRProxy._createRequest(this._xhr);
  private _response: XhrResponse = XHRProxy._createResponse();
  private _responseText: string = "";
  private _responseXML: Document | null = null;
  private _lengthComputable: boolean = false;
  private _loaded: number = 0;
  private _total: number = 0;
  
  public readyState = 0;
  public status = 0;
  public statusText = "";
  public timeout: number = 0;
  public readonly upload = this._xhr.upload;
  
  public response: BodyInit|Document|null|undefined = "";
  public responseType: XMLHttpRequestResponseType = "";
  public responseURL: string = "";
  public get responseText(): string {
    if(this.responseType === "text" || this.responseType === ""){
      return this._responseText;
    }
    /* istanbul ignore next */
    else if(isIE(">=", 10)){
      return this._responseText;
    }
    const e = new Error("responseText is only available if responseType is '' or 'text'.");
    e.name = "InvalidStateError";
    throw e;
  }
  public get responseXML(): Document | null {
    if(this.responseType === "document" || this.responseType === ""){
      return this._responseXML;
    }
    /* istanbul ignore next */
    else if(isIE(">=", 10)){
      return this._responseXML;
    }
    const e = new Error("responseXML is only available if responseType is '' or 'document'.");
    e.name = "InvalidStateError";
    throw e;
  }
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
    this._onError = this._onError.bind(this);
    this._createRequestCallback = this._createRequestCallback.bind(this);
    this._loadLoadingProgress = this._loadLoadingProgress.bind(this);
  
    const addEventListener = <K extends keyof XMLHttpRequestEventMap>(type: K) => {
      this.addEventListener(type, this._onError);
    }
    addEventListener("error");
    addEventListener("timeout");
    addEventListener("abort");
    
    this._xhr.onreadystatechange = () => {
      // According to https://xhr.spec.whatwg.org/#the-abort()-method
      // onreadystatechange should not be called,
      // but some major browsers seems to call it actually.
      /*
      if(this._isAborted){
        return;
      }
      */
  
      const realReadyState = this._xhr.readyState;
      
      if(realReadyState === this.HEADERS_RECEIVED){
        /* istanbul ignore if */
        if(isIE("<=", 9) && /* istanbul ignore next */ this._request.async === false){
          // For synchronous request in IE <= 9, it throws Error when accessing xhr header if readyState is less than LOADING.
          // this._loadHeaderFromXHRToVirtualResponse();
        }
        else{
          this._loadHeaderFromXHRToVirtualResponse();
        }
      }
      else if(realReadyState === this.LOADING){
        this._loadHeaderFromXHRToVirtualResponse();
      }
      else if(realReadyState === this.DONE){
        this._transitioning = false;
        this._loadHeaderFromXHRToVirtualResponse();
        this._loadBodyFromXHRToVirtualResponse();
      }
      
      this._runUntil(realReadyState);
    };
    
    this._xhr.addEventListener("progress", this._loadLoadingProgress);
    this._xhr.addEventListener("load", this._loadLoadingProgress);
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
    
    const index = this._listeners[type].indexOf(listener);
    if(index < 0){
      return;
    }
    
    this._listeners[type].splice(index, 1);
  }
  
  public dispatchEvent(event: Event|ProgressEvent<XMLHttpRequestEventTarget>){
    if(typeof event !== "object"){
      throw new TypeError("EventTarget.dispatchEvent: Argument 1 is not an object");
    }
    
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
    if(!listeners){
      return true;
    }
    
    for(let i=0;i<listeners.length;i++){
      // If `event.stopImmediatePropagation` is called, stop calling listeners any more.
      if(event.cancelBubble){
        break;
      }
      
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
      ...XHRProxy._createRequest(this._xhr),
      headers: {},
      method,
      url,
      async: async !== false,
      username,
      password,
    };
    
    this._response = {
      ...XHRProxy._createResponse(),
      headers: {},
    };
    
    this._runUntil(this.OPENED);
  }
  
  public send(body?: Document | BodyInit | null) {
    if(this._readyState !== this.OPENED){
      throw new DOMException("XMLHttpRequest state must be OPENED");
    }
  
    this._setupVirtualRequestForSending(body);
    this._syncEventListenersToXHR();
    
    let isDispatchXHRSendCalled = false;
  
    const dispatchXHRSend = () => {
      isDispatchXHRSendCalled = true;
      
      // When requestCallback is used, readystate is automatically move forward to 'DONE'
      // and produce dummy response.
      if(this._readyState === this.DONE){
        return;
      }
    
      this._transitioning = true;
      
      const async = this._request.async !== false;
    
      this._xhr.open(
        this._request.method,
        this._request.url,
        async,
        this._request.username,
        this._request.password
      );
    
      if(async){
        this._xhr.responseType = this.responseType;
        this._xhr.timeout = this.timeout;
      }
      this._xhr.withCredentials = this.withCredentials;
    
      this.dispatchEvent(makeProgressEvent("loadstart", this, false, false, 0, 0));
    
      const headerMap = this._request.headers;
      const headerNames = headerMap ? Object.keys(headerMap) : [];
      for(let i=0;i<headerNames.length;i++){
        const headerName = headerNames[i];
        const headerValue = headerMap[headerName];
        this._xhr.setRequestHeader(headerName, headerValue);
      }
    
      this._xhr.send(this._request.body);
    };
  
    const listeners = XSpy.getRequestListeners();
    let listenerPointer = 0;
  
    const executeNextListener = (): unknown => {
      try{
        if(listenerPointer >= listeners.length){
          return dispatchXHRSend();
        }
      
        const l = listeners[listenerPointer];
      
        // l: (request, callback) => unknown
        if(l.length >= 2){
          const userCallback = this._createRequestCallback(() => {
            listenerPointer++;
            executeNextListener();
          });
        
          l.call(this, this._request, userCallback as RequestCallback<"xhr"|"fetch">);
          return;
        }
      
        // l: (request) => unknown
        l.call(this, this._request);
      
        listenerPointer++;
        executeNextListener();
      }
      catch(e){
        console.warn("XMLHttpRequest: Exception in request handler", e);
      
        if(!isDispatchXHRSendCalled){
          listenerPointer++;
          executeNextListener();
        }
      }
    };
  
    executeNextListener();
  }
  
  public setRequestHeader(name: string, value: string) {
    if(this.readyState !== this.OPENED){
      throw new DOMException("XMLHttpRequest state must be OPENED");
    }
    
    if(!this._request.headers){
      this._request.headers = {};
    }
    
    const lowerName = name.toLowerCase();
    if(this._request.headers[lowerName]){
      value = this._request.headers[lowerName] + ", " + value;
    }
    
    this._request.headers[lowerName] = value;
  }
  
  public getResponseHeader(name: string): string | null {
    const lowerHeaderName = name.toLowerCase();
    if(this.readyState < this.HEADERS_RECEIVED || !(lowerHeaderName in this._response.headers)){
      // IE <= 9 throws Error when readyState is UNSENT
      /* istanbul ignore next */
      if(isIE("<=", 9)){
        if(this.readyState < this.OPENED){
          throw new Error();
        }
        return "";
      }
      return null;
    }
    return this._response.headers[lowerHeaderName];
  }
  
  public getAllResponseHeaders(): string {
    if(this.readyState < this.HEADERS_RECEIVED){
      // According to MDN, getAllResponseHeaders returns null if headers are not yet received.
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
      // But lib.dom.d.ts asserts it always returns string.
      // Don't know which is correct.
      
      // IE <= 9 throws Error when readyState is UNSENT
      /* istanbul ignore next */
      if(isIE("<=", 9) && this.readyState < this.OPENED){
        throw new Error();
      }
      return "";
    }
    return toHeaderString(this._response.headers);
  }
  
  public abort() {
    // According to https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests#Synchronous_request ,
    // it should throw an Error on abort() called when using synchronous request.
    // However, it actually does not in some major browser.
    /*
    if(this._request.async === false){
      throw new Error("Invalid access error");
    }
   */
    
    this._isAborted = true;
    this.status = 0;
    this.readyState = this.UNSENT;
    this._readyState = this.UNSENT;
    
    if(this._transitioning){
      this._xhr.abort();
    }
    else{
      this.dispatchEvent(makeProgressEvent("abort", this, isIE("=", 11), true, 0, 0));
    }
    
    this._transitioning = false;
  }
  
  private static _createRequest(xhr: XMLHttpRequest): XhrRequest {
    return {
      ajaxType: "xhr" as const,
      headers: {},
      method: "GET",
      url: "",
      async: true,
      timeout: 0,
      upload: xhr.upload,
    };
  }
  
  private static _createResponse(){
    return {
      ajaxType: "xhr" as const,
      status: 0,
      statusText: "",
      finalUrl: "",
      responseType: "" as const,
      headers: {},
    };
  }
  
  private _setupVirtualRequestForSending(body?: Document | BodyInit | null){
    this._request.responseType = this.responseType;
    this._request.timeout = this.timeout;
    this._request.withCredentials = this.withCredentials;
    this._request.body = body;
    this._xhr.onabort = typeof(this.onabort) === "function" ? this.onabort.bind(this) : null;
    this._xhr.onerror = typeof(this.onerror) === "function" ? this.onerror.bind(this) : null;
    this._xhr.ontimeout = typeof(this.ontimeout) === "function" ? this.ontimeout.bind(this) : null;
    this._xhr.onprogress = typeof(this.onprogress) === "function" ? this.onprogress.bind(this) : null;
  }
  
  private _syncEventListenersToXHR(){
    const addEventListeners = <K extends keyof XMLHttpRequestEventMap>(type: K) => {
      const localListeners = this._listeners[type];
      if(!localListeners || localListeners.length < 1){
        return;
      }
    
      for(let i=0;i<localListeners.length;i++){
        this._xhr.addEventListener(type, localListeners[i].bind(this));
      }
    };
  
    addEventListeners("abort");
    addEventListeners("error");
    addEventListeners("timeout");
    addEventListeners("progress");
  }
  
  private _createRequestCallback(onCalled: () => unknown) : RequestCallback<"xhr"> {
    type RequestCallbackOnlyWithDefaultFunc = {
      (dummyResponse: XhrResponse): unknown;
      moveToHeaderReceived?: (dummyResponse: XhrResponse) => void;
      moveToLoading?: (dummyResponse: XhrResponse) => void;
    };
    
    const cb: RequestCallbackOnlyWithDefaultFunc = (response: XhrResponse) => {
      if(!response || typeof response !== "object"){
        onCalled();
        return;
      }
      
      this.dispatchEvent(makeProgressEvent("loadstart", this, false, false, 0, 0));
  
      this._response = {
        ...this._response,
        ...response,
      };
  
      this._runUntil(this.DONE);
  
      onCalled();
    };
    
    const moveToHeaderReceived = (response: XhrResponse) => {
      if(this.readyState >= this.HEADERS_RECEIVED){
        return;
      }
      this._response = {
        ...this._response,
        ...response,
      };
      this._runUntil(this.HEADERS_RECEIVED);
    };
    
    const moveToLoading = (response: XhrResponse) => {
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
    
    return cb as RequestCallback<"xhr">;
  }
  
  private _createResponseCallback(onCalled: () => unknown) : ResponseCallback<"xhr"> {
    return (response: XhrResponse) => {
      if(!response || typeof response !== "object"){
        onCalled();
        return;
      }
      
      this._response = {
        ...this._response,
        ...response,
      };
      
      onCalled();
    };
  }
  
  private _loadHeaderFromXHRToVirtualResponse(){
    this._response.status = this._xhr.status;
    if(!this._isAborted){
      this._response.statusText = this._xhr.statusText;
    }
    else{
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
  
  private _loadBodyFromXHRToVirtualResponse(){
    if(!this._xhr.responseType){
      this._response.responseText = this._xhr.responseText;
      this._response.responseXML = this._xhr.responseXML;
      this._response.response = this._xhr.responseText;
    }
    else if(this._xhr.responseType === "text"){
      this._response.responseText = this._xhr.responseText;
      this._response.response = this._xhr.responseText;
    }
    else if(this._xhr.responseType === "document"){
      this._response.responseXML = this._xhr.responseXML;
      this._response.response = this._xhr.responseXML;
    }
    else{
      this._response.response = this._xhr.response;
    }
    
    if("responseURL" in this._xhr){
      this._response.responseURL = this._xhr.responseURL;
    }
  }
  
  
  private _loadLoadingProgress(e: ProgressEvent<XMLHttpRequestEventTarget>){
    this._lengthComputable = e.lengthComputable;
    this._loaded = e.loaded;
    this._total = e.total;
  }
  
  private _syncHeaderFromVirtualResponse(){
    this.status = this._response.status;
    this.statusText = this._response.statusText;
    // Response headers will be requested via getResponseHeader/getAllResponseHeaders
    // which get header values directly from this._response.
  }
  
  private _syncBodyFromVirtualResponse(){
    if("responseText" in this._response){
      this._responseText = this._response.responseText || "";
    }
    if("responseXML" in this._response){
      this._responseXML = this._response.responseXML || null;
    }
    if("body" in this._response){
      this.response = this._response.body || null;
    }
    if("response" in this._response){
      this.response = this._response.response;
    }
    if("responseURL" in this._response){
      this.responseURL = this._response.responseURL || "";
    }
  }
  
  private _onError(){
    this._hasError = true;
    this._readyState = this.UNSENT;
    this.readyState = this.UNSENT;
    this.status = 0;
  }
  
  private _triggerStateAction(){
    const readyStateChangeEvent = createXHREvent("readystatechange", this, isIE("=", 11));
    
    if(this._readyState === this.OPENED){
      this.dispatchEvent(readyStateChangeEvent);
    }
    else if(this._readyState === this.HEADERS_RECEIVED){
      this._syncHeaderFromVirtualResponse();
      this.dispatchEvent(readyStateChangeEvent);
    }
    else if(this._readyState === this.LOADING){
      this._syncHeaderFromVirtualResponse();
      this.dispatchEvent(readyStateChangeEvent);
    }
    else if(this._readyState === this.DONE){
      this._syncHeaderFromVirtualResponse();
      this._syncBodyFromVirtualResponse();
      
      let isReturnResponseCalled = false;
      
      const returnResponse = () => {
        isReturnResponseCalled = true;
        
        // Re-sync for a case that this._request/this._response is modified in callback
        this._syncHeaderFromVirtualResponse();
        this._syncBodyFromVirtualResponse();
  
        this.dispatchEvent(readyStateChangeEvent);
  
        const emitLoadEvent = () => {
          if(!this._hasError){
            this.dispatchEvent(makeProgressEvent("load", this, false, this._lengthComputable, this._loaded, this._total));
          }
          this.dispatchEvent(makeProgressEvent("loadend", this, false, this._lengthComputable, this._loaded, this._total));
        };
  
        if(this._request.async === false){
          emitLoadEvent();
        }
        else{
          window.setTimeout(emitLoadEvent, 0);
        }
      };
  
      const listeners = XSpy.getResponseListeners();
      let listenerPointer = 0;
  
      const executeNextListener = (): unknown => {
        try{
          if(listenerPointer >= listeners.length){
            return returnResponse();
          }
      
          const l = listeners[listenerPointer];
      
          // l: (request, response, callback) => unknown
          if(l.length >= 3){
            const userCallback = this._createResponseCallback(() => {
              listenerPointer++;
              executeNextListener();
            });
        
            l.call(this, this._request, this._response, userCallback);
            return;
          }
      
          // l: (request, response) => unknown
          l.call(this, this._request, this._response);
      
          listenerPointer++;
          executeNextListener();
        }
        catch(e){
          console.warn("XMLHttpRequest: Exception in response handler", e);
      
          if(!isReturnResponseCalled){
            listenerPointer++;
            executeNextListener();
          }
        }
      };
  
      executeNextListener();
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
