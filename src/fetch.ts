import {Proxy} from "./Proxy";
import {FetchRequest, FetchResponse, RequestCallback, ResponseCallback, TResponse} from "./index.type";

class FetchProxy {
  private _request: FetchRequest;
  private _response: FetchResponse;
  private _input?: RequestInfo;
  private _init?: RequestInit;
  
  public constructor(input: RequestInfo, init?: RequestInit) {
    this._input = input;
    this._init = init;
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
          const res = response as FetchResponse;
          res.ajaxType = "fetch";
          this._response = res;
          
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
        const res = new Response(this._response.body, this._response);
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
          if(l.length >= 2){
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
        ajaxType: "fetch",
        ...(init||{}),
        url: input,
      } as FetchRequest;
      
      if(init && init.headers){
        req.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
      }
      
      return req;
    }
    else{
      const req = {
        ajaxType: "fetch",
        ...(input||{}),
        ...(init||{}),
        timeout: 0,
      } as FetchRequest;
  
      if(init && init.headers){
        req.headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
      }
      
      return req;
    }
  }
  
  private static _createResponse(body?: BodyInit | null, init?: ResponseInit): FetchResponse {
    const res = new Response(body, init) as FetchResponse;
    res.ajaxType = "fetch";
    return res;
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
  
      const res = new Response(response.body, response) as FetchResponse;
      res.ajaxType = "fetch";
      this._response = res;
    };
    
    cb.moveToHeaderReceived = () => { return; };
    cb.moveToLoading = () => { return; };
    
    return cb as RequestCallback<"fetch">;
  }
  
  private _createResponseCallback(onCalled: () => unknown) : ResponseCallback<"fetch"> {
    return (response: TResponse<"fetch">) => {
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
  
}

export function fetchProxy(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const fetch = new FetchProxy(input, init);
  return fetch.dispatch();
}