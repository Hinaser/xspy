import {Proxy} from "./Proxy";
import {FetchRequest, FetchResponse, RequestCallback, ResponseCallback, TResponse} from "./index.type";
import {ResponseProxy} from "./Response";

class FetchProxy {
  private _request: FetchRequest;
  private _response: FetchResponse;
  private _input?: RequestInfo;
  private _init?: RequestInit;
  
  public constructor(input: RequestInfo, init?: RequestInit) {
    this._input = input;
    this._init = init;
  
    this.dispatch = this.dispatch.bind(this);
    this._onResponse = this._onResponse.bind(this);
    this._createRequestCallback = this._createRequestCallback.bind(this);
    this._createResponseCallback = this._createResponseCallback.bind(this);
    
    this._request = FetchProxy._createRequest(input, init);
    this._response = FetchProxy._createResponse();
  }
  
  public dispatch(): Promise<Response> {
    return new Promise((resolve, reject) => {
      const originalResponse = this._response;
      let isDispatchFetchCalled = false;
      
      const dispatchFetch = () => {
        isDispatchFetchCalled = true;
        
        if(originalResponse !== this._response){
          this._onResponse().then((response) => {
            resolve(response);
          });
          return;
        }
        
        Proxy.OriginalFetch(this._request.url, this._request).then(response => {
          const headers: Record<string, string> = {};
          for(const key of response.headers.keys()){
            const value = response.headers.get(key)
            if(value){
              headers[key] = value;
            }
          }
          
          this._response = {
            ajaxType: "fetch",
            status: response.status,
            statusText: response.statusText,
            headers,
            ok: response.ok,
            redirected: response.redirected,
            type: response.type,
            url: response.url,
            body: response.body,
          };
          
          this._onResponse().then(r => {
            resolve(r);
          });
        });
      };
  
      const requestListeners = Proxy.getRequestListeners();
      let listenerPointer = 0;
  
      const executeNextListener = (): unknown => {
        try{
          if(listenerPointer >= requestListeners.length){
            return dispatchFetch();
          }
      
          const l = requestListeners[listenerPointer];
      
          // l: (request, callback) => unknown
          if(l.length >= 2){
            const userCallback = this._createRequestCallback(() => {
              listenerPointer++;
              executeNextListener();
            });
        
            l.call({}, this._request, userCallback as RequestCallback<"xhr"|"fetch">);
            return;
          }
      
          // l: (request) => unknown
          l.call({}, this._request);
      
          listenerPointer++;
          executeNextListener();
        }
        catch(e){
          console.warn("XMLHttpRequest: Exception in request handler", e);
      
          if(!isDispatchFetchCalled){
            listenerPointer++;
            executeNextListener();
          }
        }
      };
  
      executeNextListener();
    });
  }
  
  private _onResponse(){
    return new Promise<Response>((resolve => {
      let isReturnResponseCalled = false;
  
      const returnResponse = () => {
        isReturnResponseCalled = true;
        const res = new ResponseProxy(this._response.body, this._response);
        res.url = this._response.url;
        res.type = this._response.type;
        res.redirected = this._response.redirected;
        res.ok = this._response.ok;
        resolve(res);
      };
  
      const responseListeners = Proxy.getResponseListeners();
      let listenerPointer = 0;
  
      const executeNextListener = (): unknown => {
        try{
          if(listenerPointer >= responseListeners.length){
            return returnResponse();
          }
      
          const l = responseListeners[listenerPointer];
      
          // l: (request, response, callback) => unknown
          if(l.length >= 3){
            const userCallback = this._createResponseCallback(() => {
              listenerPointer++;
              executeNextListener();
            });
        
            l.call({}, this._request, this._response, userCallback);
            return;
          }
      
          // l: (request, response) => unknown
          l.call({}, this._request, this._response);
      
          listenerPointer++;
          executeNextListener();
        }
        catch(e){
          console.warn("XMLHttpRequest: Exception in request handler", e);
      
          if(!isReturnResponseCalled){
            listenerPointer++;
            executeNextListener();
          }
        }
      };
  
      executeNextListener();
    }));
  }
  
  private static _createRequest(input: RequestInfo, init?: RequestInit): FetchRequest {
    if(typeof input === "string"){
      const req = {
        ...(init||{}),
        ajaxType: "fetch",
        headers: {},
        url: input,
      } as FetchRequest;
      
      if(init && init.headers){
        const headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
        for(const key of headers.keys()){
          const value = headers.get(key);
          if(value){
            req.headers[key] = value;
          }
        }
      }
      
      return req;
    }
    else{
      const headers = input.headers || (init && init.headers ? init.headers : null);
      
      const req = {
        ...(init||{}),
        ajaxType: "fetch",
        method: input.method,
        url: input.url,
        timeout: 0,
        headers: {},
        // input.body may be `undefined` since major browsers does not support it as of 2020/08/06.
        // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#bcd:api.Request.Request
        body: input.body,
        cache: input.cache,
        credentials: input.credentials,
        integrity: input.integrity,
        keepalive: input.keepalive,
        mode: input.mode,
        redirect: input.redirect,
        referrer: input.referrer,
        referrerPolicy: input.referrerPolicy,
        signal: input.signal,
      } as FetchRequest;
  
      if(headers){
        for(const key of headers.keys()){
          const value = headers.get(key);
          if(value){
            req.headers[key] = value;
          }
        }
      }
      
      return req;
    }
  }
  
  private static _createResponse(): FetchResponse {
    return {
      ajaxType: "fetch",
      status: 0,
      statusText: "",
      headers: {},
      ok: true,
      redirected: false,
      type: "basic",
      url: "",
      body: null,
    };
  }
  
  private _createRequestCallback(onCalled: () => unknown): RequestCallback<"fetch"> {
    type RequestCallbackOnlyWithDefaultFunc = {
      (dummyResponse: FetchResponse): unknown;
      moveToHeaderReceived?: (dummyResponse: TResponse<"fetch">) => void;
      moveToLoading?: (dummyResponse: TResponse<"fetch">) => void;
    };
  
    const cb: RequestCallbackOnlyWithDefaultFunc = (response: FetchResponse) => {
      if(!response || typeof response !== "object"){
        onCalled();
        return;
      }
  
      this._response = response;
      onCalled();
    };
    
    cb.moveToHeaderReceived = () => { return; };
    cb.moveToLoading = () => { return; };
    
    return cb as RequestCallback<"fetch">;
  }
  
  private _createResponseCallback(onCalled: () => unknown) : ResponseCallback<"fetch"> {
    return (response: FetchResponse) => {
      if(!response || typeof response !== "object"){
        onCalled();
        return;
      }
      
      this._response = response;
      
      onCalled();
    };
  }
  
}

export function fetchProxy(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const fetch = new FetchProxy(input, init);
  return fetch.dispatch();
}