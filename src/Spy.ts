import {EventType, RequestHandler, ResponseHandler, WindowEx} from "./index.type";

declare let window: WindowEx;

export class Spy {
  private static _reqListeners: RequestHandler[] = [];
  private static _resListeners: ResponseHandler[] = [];
  private static _agent = window.XMLHttpRequest;
  public static readonly OriginalXHR = window.XMLHttpRequest;
  
  public static enable() {
    window.XMLHttpRequest = Spy._agent;
  }
  
  public static disable() {
    window.XMLHttpRequest = Spy.OriginalXHR;
  }
  
  public static setXMLHttpRequestWithSpy(m: typeof window["XMLHttpRequest"]){
    Spy._agent = m;
  }
  
  public static getRequestListeners() {
    const listeners = Spy._reqListeners;
    return listeners.slice();
  }
  
  public static getResponseListeners() {
    const listeners = Spy._resListeners;
    return listeners.slice();
  }
  
  public static onRequest(listener: RequestHandler, n?: number) {
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
  
  public static offRequest(listener: RequestHandler) {
    this._removeEventListener("request", listener);
  }
  
  public static onResponse(listener: ResponseHandler, n?: number) {
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
  
  public static offResponse(listener: ResponseHandler) {
    this._removeEventListener("response", listener);
  }
  
  public static clearAll() {
    Spy.clearRequestHandler();
    Spy.clearResponseHandler();
  }
  
  public static clearRequestHandler() {
    this._reqListeners = [];
  }
  
  public static clearResponseHandler() {
    this._resListeners = [];
  }
  
  private static _removeEventListener(type: EventType, listener: RequestHandler | ResponseHandler) {
    const listeners = type === "request" ? this._reqListeners : this._resListeners;
    
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return;
      }
    }
  }
}
