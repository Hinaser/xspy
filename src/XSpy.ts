import {EventType, RequestHandler, ResponseHandler} from "./index.type";

/**
 * XSpy extends `window` module with `xspy` property.
 * To add new property to `window` object, here defines extended window interface.
 * @ignore
 */
interface WindowEx extends Window {
  XMLHttpRequest: new() => XMLHttpRequest;
  xspy: typeof XSpy;
}

/**
 * `window` object 
 * @ignore
 */
declare let window: WindowEx;

/**
 * Original `window.fetch`
 * @ignore
 */
const originalFetch = (window.fetch || function fetch(){ return; }).bind(window);

/**
 * When loading into browser, static class `XSpy` is available by calling `window.xspy` or just `xspy`.
 * Note: Not `window.XSpy` but `window.xspy`. (All lower characters)
 * @name xspy
 */
export class XSpy {
  private static _reqListeners: Array<RequestHandler<"xhr"|"fetch">> = [];
  private static _resListeners: Array<ResponseHandler<"xhr"|"fetch">> = [];
  private static _customXHR = window.XMLHttpRequest;
  private static _customFetch = window.fetch;
  
  /**
   * Original XMLHttpRequest.  
   * window.XMLHttpRequest will be replaced to customized XMLHttpRequest on `xspy.enable()` called.
   * Regardless of whether `xspy.enable()` called, `xspy.OriginalXHR` always returns original XMLHttpRequest.
   */
  public static readonly OriginalXHR = window.XMLHttpRequest;
  
  /**
   * Original fetch.
   * window.fetch will be replaced to customized fetch on `xspy.enable()` called.
   * Regardless of whether `xspy.enable()` called, `xspy.OriginalFetch` always returns original fetch.
   */
  /* istanbul ignore next */
  public static readonly OriginalFetch = originalFetch;
  
  /**
   * Start to listen request/response from XMLHttpRequest/fetch.
   * Request/Response hook is enabled by replacing `XMLHttpRequest` and `window.fetch` to the ones in this library.
   * 
   * Note: This does not polyfill `window.fetch` for Internet Explorer which does not originally implement `window.fetch`.
   */
  public static enable() {
    window.XMLHttpRequest = XSpy._customXHR;
    /* istanbul ignore else */
    if(window.fetch){
      window.fetch = XSpy._customFetch;
    }
  }
  
  /**
   * Stop to listen request/response.
   * It replaces back to original `XMLHttpRequest` and `window.fetch`.
   */
  public static disable() {
    window.XMLHttpRequest = XSpy.OriginalXHR;
    /* istanbul ignore else */
    if(window.fetch && XSpy.OriginalFetch){
      window.fetch = XSpy.OriginalFetch;
    }
  }
  
  /**
   * Check xspy is enabled and listening request/response.
   */
  public static isEnabled(){
    return window.XMLHttpRequest === XSpy._customXHR;
  }
  
  /**
   * Set custom `XMLHttpRequest` as a spy module.
   * @ignore
   */
  public static setXMLHttpRequest(m: typeof window["XMLHttpRequest"]){
    XSpy._customXHR = m;
  }
  
  /**
   * Set custom `window.fetch` as a spy module.
   * @ignore
   */
  public static setFetch(m: typeof window["fetch"]){
    XSpy._customFetch = m;
  }
  
  /**
   * Get an array of request listeners.
   * Note that any operations (push/pop/unshift/shift) on the array does not affect saved listeners.
   */
  public static getRequestListeners() {
    const listeners = XSpy._reqListeners;
    return listeners.slice();
  }
  
  /**
   * Get an array of response listeners.
   */
  public static getResponseListeners() {
    const listeners = XSpy._resListeners;
    return listeners.slice();
  }
  
  /**
   * Add custom request `handler` to index `n`. (handler at index `n`=0 will be called first)
   * If you do not specify `n`, it appends `handler` to the last. (Called after all previous handlers finishes.)
   *
   * This `handler` will be called just before web request by `window.fetch()` or `xhr.sent()` departs from browser.
   * You can modify the request object(i.e. headers, body) before it is sent. See detail for request object later.
   *
   * Note that when you supplies `handler` as 2 parameters function(`request` and `callback`),
   * request will not be dispatched until you manually run `callback()` function in `handler`.
   *
   * If you run `callback()` without any arguments or with non-object value like `false`,
   * request processing goes forward without generating fake response.
   *
   * If you run `callback(res)` with a fake response object, it immediately returns the fake response after all onRequest handlers
   * finishes. In this case, real request never flies to any external network.
   */
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
  
  /**
   * Remove a request listener.
   */
  public static offRequest(listener: RequestHandler<"xhr"|"fetch">) {
    this._removeEventListener("request", listener);
  }
  
  /**
   * Add custom response `handler` to index `n`. (handler at index `n`=0 will be called first)
   * If you do not specify `n`, it appends `handler` to the last. (Called after all previous handlers finishes.)
   *
   * This `handler` will be called just before API response is available at
   * `window.fetch().then(res => ...)` or `xhr.onreadystatechange`, and so on.
   * You can modify the response object before it is available to the original requester. See detail for response object later.
   *
   * Note that when you supplies `handler` as 3 parameters function(`request`, `response` and `callback`),
   * response will not be returned to the original requester until you manually run `callback()` function in `handler`.
   */
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
  
  /**
   * Remove a response listener.
   */
  public static offResponse(listener: ResponseHandler<"xhr"|"fetch">) {
    this._removeEventListener("response", listener);
  }
  
  /**
   * Remove all request/response listeners.
   */
  public static clearAll() {
    XSpy.clearRequestHandler();
    XSpy.clearResponseHandler();
  }
  
  /**
   * Remove all request listeners.
   */
  public static clearRequestHandler() {
    this._reqListeners = [];
  }
  
  /**
   * Remove all response listeners.
   */
  public static clearResponseHandler() {
    this._resListeners = [];
  }
  
  /**
   * @ignore
   */
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
