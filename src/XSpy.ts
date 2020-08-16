import {ListenerForRequest, ListenerForResponse} from "./index.type";

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
 * After a document loads `XSpy` class, it is available by calling `window.xspy` or just `xspy`.<br/>
 * Note: Not `window.XSpy` but `window.xspy`. (All lower characters)
 * @name xspy
 */
export class XSpy {
  private static _reqListeners: Array<ListenerForRequest<"xhr"|"fetch">> = [];
  private static _resListeners: Array<ListenerForResponse<"xhr"|"fetch">> = [];
  private static _customXHR = window.XMLHttpRequest;
  private static _customFetch = window.fetch;
  
  /**
   * Original XMLHttpRequest.  
   * window.XMLHttpRequest will be replaced to customized XMLHttpRequest on `xspy.enable()` called.
   * Regardless of whether `xspy.enable()` called, `xspy.OriginalXHR` always returns original XMLHttpRequest.
   * 
   * @example
   * ```js
   * if(window.XMLHttpRequest !== xspy.OriginalXHR){
   *   // xspy is enabled and `XMLHttpRequest` is replaced by spying module.
   * }
   * ```
   */
  public static readonly OriginalXHR = window.XMLHttpRequest;
  
  /**
   * Original fetch.
   * window.fetch will be replaced to customized fetch on `xspy.enable()` called.
   * Regardless of whether `xspy.enable()` called, `xspy.OriginalFetch` always returns original fetch.
   *
   * @example
   * ```js
   * if(window.fetch !== xspy.OriginalFetch){
   *   // xspy is enabled and `window.fetch` is replaced by spying module.
   * }
   * ```
   */
  /* istanbul ignore next */
  public static readonly OriginalFetch = originalFetch;
  
  /**
   * Start to listen request/response from XMLHttpRequest/fetch.
   * Request/Response hook is enabled by replacing `XMLHttpRequest` and `window.fetch` to the ones in this library.
   * 
   * Note: This does not polyfill `window.fetch` for Internet Explorer which does not originally implement `window.fetch`.
   * 
   * @example
   * ```js
   * xspy.enable(); // XMLHttpRequest and fetch are replaced by spying modules.
   * ```
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
   *
   * @example
   * ```js
   * xspy.disable(); // XMLHttpRequest and fetch are set back to original modules.
   * ```
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
   *
   * @example
   * ```js
   * if(xspy.isEnabled()){
   *   // then `window.XMLHttpRequest !== xspy.OriginalXHR`
   * }
   * ```
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
   * 
   * @example
   * ```js
   * var listeners = xspy.getRequestListeners();
   * ```
   */
  public static getRequestListeners() {
    const listeners = XSpy._reqListeners;
    return listeners.slice();
  }
  
  /**
   * Get an array of response listeners.
   *
   * @example
   * ```js
   * var listeners = xspy.getResponseListeners();
   * ```
   */
  public static getResponseListeners() {
    const listeners = XSpy._resListeners;
    return listeners.slice();
  }
  
  /**
   * Add custom request `listener` to index `n`. (listener at index `n`=0 will be called first)
   * If you do not specify `n`, it appends `listener` to the last. (Called after all previous listeners finishes.)
   *
   * This `listener` will be called just before web request by `window.fetch()` or `xhr.sent()` departs from browser.
   * You can modify the request object(i.e. headers, body) before it is sent.
   *
   * Note that when you supplies `listener` as 2 parameters function(`request` and `callback`),
   * request will not be dispatched until you manually run `callback()` function in `handler`.
   *
   * If you run `callback()` without any arguments or with non-object value like `false`,
   * request processing goes forward without generating fake response.
   *
   * If you run `callback(res)` with a fake response object, it immediately returns the fake response after all onRequest listeners
   * finishes. In this case, real request never flies to any external network.
   *
   * @example Modify request before dispatched
   * ```js
   * xspy.onRequest(function (request){
   *   request.method = "POST";
   *   request.url = "...";
   *   ...
   * });
   * ```
   *
   * @example Return fake response after waiting 3000ms
   * ```js
   * xspy.onRequest(function (request, sendResponse){
   *   setTimeout(function(){
   *     var response = {status: 200, statusText: "OK"};
   *     sendResponse(response); // after 3000ms elapses, send fake response.
   *   }, 3000);
   * });
   * ```
   *
   * @example Return fake response after awaited async operation
   * ```js
   * xspy.onRequest(async (request, sendResponse) => {
   *   var result = await someAsyncOperation();
   *   
   *   var response = {status: 200, statusText: "OK", body: result};
   *   sendResponse(response);
   * });
   * ```
   */
  public static onRequest(listener: ListenerForRequest<"xhr"|"fetch">, n?: number) {
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
   * 
   * @example
   * ```js
   * var listener = function(request){...};
   * xspy.onRequest(listener);  // xspy.getRequestListeners().length === 1
   * xspy.offRequest(listener); // xspy.getRequestListeners().length === 0
   * ```
   */
  public static offRequest(listener: ListenerForRequest<"xhr"|"fetch">) {
    this._removeEventListener("request", listener);
  }
  
  /**
   * Add custom response `listener` to index `n`. (listener at index `n`=0 will be called first)
   * If you do not specify `n`, it appends `listener` to the last. (Called after all previous listeners finishes.)
   *
   * This `listener` will be called just before API response is available at
   * `window.fetch().then(res => ...)` or `xhr.onreadystatechange`, and so on.
   * You can modify the response object before it is available to the original requester.
   *
   * Note that when you supplies `listener` as 3 parameters function(`request`, `response` and `callback`),
   * response will not be returned to the original requester until you manually run `callback()` function in `handler`.
   *
   * @example Modify response before it is available to user scripts
   * ```js
   * xspy.onResponse(function (request, response){
   *   response.status = 400;
   *   response.statusText = "Bad Request";
   *   response.body = "";
   *   ...
   * });
   * ```
   *
   * @example Return response after waiting 3000ms
   * ```js
   * xspy.onResponse(function (request, response, next){
   *   setTimeout(function(){
   *     var response = {status: 200, statusText: "OK"};
   *     next(response); // after 3000ms elapses, send the response.
   *   }, 3000);
   * });
   * ```
   *
   * @example Return response after awaited async operation
   * ```js
   * xspy.onResponse(async (request, response, next) => {
   *   var result = await someAsyncOperation();
   *   
   *   var response = {status: 200, statusText: "OK", body: result};
   *   next(response);
   * });
   * ```
   */
  public static onResponse(listener: ListenerForResponse<"xhr"|"fetch">, n?: number) {
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
   *
   * @example
   * ```js
   * var listener = function(request){...};
   * xspy.onResponse(listener);  // xspy.getResponseListeners().length === 1
   * xspy.offResponse(listener); // xspy.getResponseListeners().length === 0
   * ```
   */
  public static offResponse(listener: ListenerForResponse<"xhr"|"fetch">) {
    this._removeEventListener("response", listener);
  }
  
  /**
   * Remove all request/response listeners.
   *
   * @example
   * ```js
   * xspy.clearAll();
   * // xspy.getRequestListeners().length === 0
   * // xspy.getResponseListeners().length === 0
   * ```
   */
  public static clearAll() {
    XSpy.clearRequestHandler();
    XSpy.clearResponseHandler();
  }
  
  /**
   * Remove all request listeners.
   *
   * @example
   * ```js
   * xspy.clearRequestHandler();
   * // xspy.getRequestListeners().length === 0
   * ```
   */
  public static clearRequestHandler() {
    this._reqListeners = [];
  }
  
  /**
   * Remove all response listeners.
   *
   * @example
   * ```js
   * xspy.clearResponseHandler();
   * // xspy.getResponseListeners().length === 0
   * ```
   */
  public static clearResponseHandler() {
    this._resListeners = [];
  }
  
  private static _removeEventListener(
    type: "request"|"response",
    listener: ListenerForRequest<"xhr"|"fetch"> | ListenerForResponse<"xhr"|"fetch">
  ){
    const listeners = type === "request" ? this._reqListeners : this._resListeners;
    
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return;
      }
    }
  }
}
