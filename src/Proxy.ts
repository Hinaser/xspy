import {EventType, RequestHandler, ResponseHandler, WindowEx} from "./index.type";

declare let window: WindowEx;

export class Proxy {
  private static _reqListeners: Array<RequestHandler<"xhr"|"fetch">> = [];
  private static _resListeners: Array<ResponseHandler<"xhr"|"fetch">> = [];
  private static _customXHR = window.XMLHttpRequest;
  private static _customFetch = window.fetch;
  public static readonly OriginalXHR = window.XMLHttpRequest;
  /* Only IE does not implement `window.fetch`. Exclude from coverage counting. */
  /* istanbul ignore next */
  public static readonly OriginalFetch = (window.fetch || function fetch(){ return; }).bind(window);
  
  public static enable() {
    window.XMLHttpRequest = Proxy._customXHR;
    /* istanbul ignore else */
    if(window.fetch){
      window.fetch = Proxy._customFetch;
    }
  }
  
  public static disable() {
    window.XMLHttpRequest = Proxy.OriginalXHR;
    /* istanbul ignore else */
    if(window.fetch && Proxy.OriginalFetch){
      window.fetch = Proxy.OriginalFetch;
    }
  }
  
  public static isEnabled(){
    return window.XMLHttpRequest === Proxy._customXHR;
  }
  
  public static setXMLHttpRequest(m: typeof window["XMLHttpRequest"]){
    Proxy._customXHR = m;
  }
  
  public static setFetch(m: typeof window["fetch"]){
    Proxy._customFetch = m;
  }
  
  public static getRequestListeners() {
    const listeners = Proxy._reqListeners;
    return listeners.slice();
  }
  
  public static getResponseListeners() {
    const listeners = Proxy._resListeners;
    return listeners.slice();
  }
  
  public static onRequest(listener: RequestHandler<"xhr"|"fetch">, n?: number) {
    const listeners = this._reqListeners;
    if (listeners.indexOf(listener) > -1) {
      return;
    }
  
    if (typeof n === "number") {
      listeners.splice(n, 0, listener);
    } else {
      listeners.push(listener);
    }
  }
  
  public static offRequest(listener: RequestHandler<"xhr"|"fetch">) {
    this._removeEventListener("request", listener);
  }
  
  public static onResponse(listener: ResponseHandler<"xhr"|"fetch">, n?: number) {
    const listeners = this._resListeners;
    if (listeners.indexOf(listener) > -1) {
      return;
    }
  
    if (typeof n === "number") {
      listeners.splice(n, 0, listener);
    } else {
      listeners.push(listener);
    }
  }
  
  public static offResponse(listener: ResponseHandler<"xhr"|"fetch">) {
    this._removeEventListener("response", listener);
  }
  
  public static clearAll() {
    Proxy.clearRequestHandler();
    Proxy.clearResponseHandler();
  }
  
  public static clearRequestHandler() {
    this._reqListeners = [];
  }
  
  public static clearResponseHandler() {
    this._resListeners = [];
  }
  
  private static _removeEventListener(type: EventType, listener: RequestHandler<"xhr"|"fetch"> | ResponseHandler<"xhr"|"fetch">) {
    const listeners = type === "request" ? this._reqListeners : this._resListeners;
    
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return;
      }
    }
  }
}
