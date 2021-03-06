import { ListenerForRequest, ListenerForResponse } from "./index.type";
/**
 * XSpy extends `window` module with `xspy` property.
 * To add new property to `window` object, here defines extended window interface.
 * @ignore
 */
interface WindowEx extends Window {
    XMLHttpRequest: new () => XMLHttpRequest;
    xspy: typeof XSpy;
}
/**
 * `window` object
 * @ignore
 */
declare let window: WindowEx;
/**
 * After a document loads `XSpy` class, it is available by calling `window.xspy` or just `xspy`.<br/>
 * Note: Not `window.XSpy` but `window.xspy`. (All lower characters)
 * @name xspy
 */
export declare class XSpy {
    private static _reqListeners;
    private static _resListeners;
    private static _customXHR;
    private static _customFetch;
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
    static readonly OriginalXHR: new () => XMLHttpRequest;
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
    static readonly OriginalFetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
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
    static enable(): void;
    /**
     * Stop to listen request/response.
     * It replaces back to original `XMLHttpRequest` and `window.fetch`.
     *
     * @example
     * ```js
     * xspy.disable(); // XMLHttpRequest and fetch are set back to original modules.
     * ```
     */
    static disable(): void;
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
    static isEnabled(): boolean;
    /**
     * Set custom `XMLHttpRequest` as a spy module.
     * @ignore
     */
    static setXMLHttpRequest(m: typeof window["XMLHttpRequest"]): void;
    /**
     * Set custom `window.fetch` as a spy module.
     * @ignore
     */
    static setFetch(m: typeof window["fetch"]): void;
    /**
     * Get an array of request listeners.
     * Note that any operations (push/pop/unshift/shift) on the array does not affect saved listeners.
     *
     * @example
     * ```js
     * var listeners = xspy.getRequestListeners();
     * ```
     */
    static getRequestListeners(): ListenerForRequest<"xhr" | "fetch">[];
    /**
     * Get an array of response listeners.
     *
     * @example
     * ```js
     * var listeners = xspy.getResponseListeners();
     * ```
     */
    static getResponseListeners(): ListenerForResponse<"xhr" | "fetch">[];
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
     *   return;
     * });
     * ```
     *
     * @example Return fake response after waiting 3000ms
     * ```js
     * xspy.onRequest(function listenerForRequest(request, sendResponse){
     *   setTimeout(function(){
     *     var response = {
     *       status: 200,
     *       statusText: "OK",
     *       headers: {"content-type": "application/json"},
     *     };
     *
     *     if(request.ajaxType === "xhr"){
     *       response = {
     *         ajaxType: "xhr",
     *         response: {result: 3},
     *         responseType: "json",
     *         responseText: "{'result':3}",
     *       };
     *     }
     *     else{ // ajaxType === "fetch"
     *       response = {
     *         ajaxType: "fetch",
     *         ok: true,
     *         redirected: false,
     *         type: "basic",
     *         body: "{'result':3}",
     *         url: "https://..."
     *       };
     *     }
     *
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
     *   var response = {...};
     *   sendResponse(response);
     * });
     * ```
     */
    static onRequest(listener: ListenerForRequest<"xhr" | "fetch">, n?: number): void;
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
    static offRequest(listener: ListenerForRequest<"xhr" | "fetch">): void;
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
     * xspy.onResponse(function listenerForResponse(request, response, next){
     *   setTimeout(function(){
     *     var modifiedResponse = {...response, status: 200, statusText: "OK"};
     *     if(response.ajaxType === "fetch"){
     *       modifiedResponse.ok = true;
     *     }
     *     next(modifiedResponse); // after 3000ms elapses, send the response.
     *   }, 3000);
     * });
     * ```
     *
     * @example Return response after awaited async operation
     * ```js
     * xspy.onResponse(async (request, response, next) => {
     *   var result = await someAsyncOperation();
     *
     *   var response = {...};
     *   next(response);
     * });
     * ```
     */
    static onResponse(listener: ListenerForResponse<"xhr" | "fetch">, n?: number): void;
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
    static offResponse(listener: ListenerForResponse<"xhr" | "fetch">): void;
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
    static clearAll(): void;
    /**
     * Remove all request listeners.
     *
     * @example
     * ```js
     * xspy.clearRequestHandler();
     * // xspy.getRequestListeners().length === 0
     * ```
     */
    static clearRequestHandler(): void;
    /**
     * Remove all response listeners.
     *
     * @example
     * ```js
     * xspy.clearResponseHandler();
     * // xspy.getResponseListeners().length === 0
     * ```
     */
    static clearResponseHandler(): void;
    private static _removeEventListener;
}
export {};
