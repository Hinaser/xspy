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
        
        Proxy.OriginalFetch(this._request).then(response => {
          this._response = {
            ...response,
            ajaxType: "fetch",
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
    return new Promise<FetchResponse>((resolve => {
      let isReturnResponseCalled = false;
  
      const returnResponse = () => {
        isReturnResponseCalled = true;
        
        resolve(this._response);
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
    return {
      ...new Request(input, init),
      ajaxType: "fetch",
      timeout: 0,
    };
  }
  
  private static _createResponse(body?: BodyInit | null, init?: ResponseInit): FetchResponse {
    return {
      ...new Response(body, init),
      ajaxType: "fetch",
      status: 0,
      statusText: "",
      headers: new Headers(),
    };
  }
  
  private _createRequestCallback(onCalled: () => unknown): RequestCallback<"fetch"> {
    type RequestCallbackOnlyWithDefaultFunc = {
      (dummyResponse: TResponse<"fetch">): unknown;
      moveToHeaderReceived?: (dummyResponse: TResponse<"fetch">) => void;
      moveToLoading?: (dummyResponse: TResponse<"fetch">) => void;
    };
  
    const cb: RequestCallbackOnlyWithDefaultFunc = (response: TResponse<"fetch">) => {
      if(!response || typeof response !== "object"){
        onCalled();
        return;
      }
  
      this._response = {
        ...this._response,
        ...response,
      };
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