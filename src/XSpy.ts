import {EventType, RequestHandler, ResponseHandler} from "./index.type";

interface WindowEx extends Window {
  XMLHttpRequest: new() => XMLHttpRequest;
  xspy: typeof XSpy;
}

declare let window: WindowEx;



export class XSpy {
  private static _reqListeners: Array<RequestHandler<"xhr"|"fetch">> = [];
  private static _resListeners: Array<ResponseHandler<"xhr"|"fetch">> = [];
  private static _customXHR = window.XMLHttpRequest;
  private static _customFetch = window.fetch;
  
  /**
   * Original prototype of XMLHttpRequest.
   * 
   */
  public static readonly OriginalXHR = window.XMLHttpRequest;
  
  /* Only IE does not implement `window.fetch`. Exclude from coverage counting. */
  /* istanbul ignore next */
  public static readonly OriginalFetch = (window.fetch || function fetch(){ return; }).bind(window);
  
  public static enable() {
    window.XMLHttpRequest = XSpy._customXHR;
    /* istanbul ignore else */
    if(window.fetch){
      window.fetch = XSpy._customFetch;
    }
  }
  
  public static disable() {
    window.XMLHttpRequest = XSpy.OriginalXHR;
    /* istanbul ignore else */
    if(window.fetch && XSpy.OriginalFetch){
      window.fetch = XSpy.OriginalFetch;
    }
  }
  
  public static isEnabled(){
    return window.XMLHttpRequest === XSpy._customXHR;
  }
  
  public static setXMLHttpRequest(m: typeof window["XMLHttpRequest"]){
    XSpy._customXHR = m;
  }
  
  public static setFetch(m: typeof window["fetch"]){
    XSpy._customFetch = m;
  }
  
  public static getRequestListeners() {
    const listeners = XSpy._reqListeners;
    return listeners.slice();
  }
  
  public static getResponseListeners() {
    const listeners = XSpy._resListeners;
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
    XSpy.clearRequestHandler();
    XSpy.clearResponseHandler();
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
