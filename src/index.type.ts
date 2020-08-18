/**
 * When called in xspy's request listener,  
 * immediately return fake response without dispatching request to external network after all listeners run.
 * 
 * You can move readyState one by one by calling `callback.moveToHeaderReceived` and/or `callback.moveToLoading`.
 * 
 * @example Return fake response step by step with simulating loading.
 * ```js
 * xspy.onRequest(function listenerForRequest(request, sendResponse){
 *   if(request.ajaxType === "xhr"){
 *     sendResponse.moveToHeaderReceived({
 *       headers: {"content-type": "application/json"},
 *       status: 200,
 *       statusText: "OK",
 *     });
 *     
 *     sendResponse.moveToLoading({
 *       headers: {"content-type": "application/json"},
 *       status: 200,
 *       statusText: "OK",
 *       responseText: "{'result':"
 *     });
 *     
 *     sendResponse({
 *       ajaxType: "xhr",
 *       status: 200,
 *       statusText: "OK",
 *       headers: {"content-type": "application/json"},
 *       response: {result: 3},
 *       responseType: "json",
 *       responseText: "{'result':3}",
 *     });
 *   }
 * });
 * ```
 */
export type CallbackForRequest<T extends "xhr" | "fetch"> = {
  /**
   * Return dummy response to user scripts after all request listeners run.
   * 
   * @example
   * ```js
   *  var dummyResponse = {
   *    ajaxType: "fetch",
   *    status: 200,
   *    statusText: "OK",
   *    headers: {"content-type": "application/json"},
   *    ok: true,
   *    redirected: false,
   *    type: "basic",
   *    body: "{'result':3",
   *    url: "https://..."
   *  };
   *  
   *  callbackForRequest(dummyResponse);
   * ```
   */
  (dummyResponse: T extends "xhr" ? ResponseByXHR : ResponseByFetch): unknown;
  /**
   * Move readyState to HEADERS_RECEIVED. This is only effective for xhr response.
   * 
   * @example
   * ```js
   * callbackForRequest.moveToHeaderReceived({
   *   headers: {"content-type": "application/json"},
   *   status: 200,
   *   statusText: "OK",
   * });
   * ```
   */
  moveToHeaderReceived: (dummyResponse: T extends "xhr" ? Pick<ResponseByXHR, "headers"|"status"|"statusText"> : never) => void;
  /**
   * Move readyState to LOADING. This is only effective for xhr response.
   *
   * @example
   * ```js
   * callbackForRequest.moveToLoading({
   *    headers: {"content-type": "application/json"},
   *    status: 200,
   *    statusText: "OK",
   *    responseText: "{'result':"
   *  });
   * ```
   */
  moveToLoading: (dummyResponse: T extends "xhr" ? Pick<ResponseByXHR, "headers"|"status"|"statusText"|"responseText"> : never) => void;
};

/**
 * Listen XHR/fetch request to be dispatched from user script and modify/view request as you like.  
 * This listener behaves differently when defined as 1 parameter function or 2 parameters function.
 * 
 * When second parameter `sendResponse` is specified as a function argument,  
 * original request stops until `sendResponse` is called in listener function.
 * 
 * @example Modify request before dispatched
 * ```js
 * xspy.onRequest(function listenerForRequest(request){
 *   request.method = "POST";
 *   request.url = "...";
 *   ...
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
 */
export type ListenerForRequest<T extends "xhr" | "fetch"> = (
  this: T extends "xhr" ? XMLHttpRequest : unknown,
  request: T extends "xhr" ? RequestByXHR : RequestByFetch,
  sendResponse?: CallbackForRequest<T>
) => unknown;

/**
 * When called in xspy's response listener, return modified response to user script.
 * This callback is useful for asynchronous operation.
 *
 * @example Return fake response step by step with simulating loading.
 * ```js
 * xspy.onResponse(async function listenerForResponse(request, response, callbackForResponse){
 *   var isValid = await checkResponse(); // Doing some async operation.
 *   
 *   if(isValid){
 *     callbackForResponse();
 *   }
 *   else{
 *     var modifiedResponse = {
 *       ...response,
 *       status: 400,
 *       statusText: "Bad Request"
 *     };
 *     if(response.ajaxType === "fetch"){
 *       modifiedResponse.ok = false;
 *     }
 *     callbackForResponse(modifiedResponse);
 *   }
 * });
 * ```
 */
export type CallbackForResponse<T extends "xhr" | "fetch">
  = (modifiedResponse: T extends "xhr" ? ResponseByXHR : ResponseByFetch) => unknown;

/**
 * Listen on XHR/fetch response returned from a server to modify/view response as you like.
 * This listener behaves differently when defined as 2 parameter function or 3 parameters function.
 *
 * When third parameter `next` is specified as a function argument,
 * user scripts will not receive response until `next` is called in listener function.
 *
 * @example Modify response before it is available to user scripts
 * ```js
 * xspy.onResponse(function listenerForResponse(request, response){
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
 */
export type ListenerForResponse<T extends "xhr" | "fetch"> = (
  this: T extends "xhr" ? XMLHttpRequest : unknown,
  request: T extends "xhr" ? RequestByXHR : RequestByFetch,
  response: T extends "xhr" ? ResponseByXHR : ResponseByFetch,
  next?: CallbackForResponse<T>
) => unknown;

/**
 * General request object whose properties is common in both XMLHttpRequest and fetch.
 */
export interface Request<T extends "xhr" | "fetch"> {
  /**
   * "xhr" or "fetch".
   * 
   * When a request is generated by `XMLHttpRequest`, then ajaxType is "xhr".  
   * 
   * When a request is generated by `window.fetch`, then ajaxType is "fetch".
   */
  ajaxType: T;
  /**
   * Http method like `GET`, `POST` and so on.
   */
  method: string;
  /**
   * Request url to send request.
   */
  url: string;
  /**
   * `timeout` is only used by XMLHttpRequest.
   */
  timeout: number;
  /**
   * Key-value pairs of a header.
   * 
   * @example
   * ```js
   * var request = {
   *   headers: {
   *     "Content-Type": "text/html",
   *     "Authorization": "xxxxxxx"
   *   }
   * };
   * ```
   */
  headers: Record<string, string>;
  /**
   * A request body.
   * 
   * BodyInit: Blob | BufferSource | FormData | URLSearchParams | ReadableStream\<Uint8Array\> | string
   */
  body?: T extends "xhr" ? BodyInit | null | Document : BodyInit | null;
}

/**
 * Request object properties only for XMLHttpRequest.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest
 */
export interface RequestByXHR extends Request<"xhr"> {
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open */
  async?: boolean;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open */
  username?: string|null;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open */
  password?: string|null;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType */
  responseType?: XMLHttpRequestResponseType;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials */
  withCredentials?: boolean;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload */
  upload?: XMLHttpRequestUpload;
}

/**
 * Request object properties only for `fetch`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Request
 */
export interface RequestByFetch extends Request<"fetch"> {
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/method */
  method: string;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/url */
  url: string;
  /**
   * A request body to be sent with method like `POST`, `PUT` and so on.
   * 
   * `body` can be various type like string, FormData, Document, Blob, URLSearchParams and so on.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Body/body
   */
  body?: BodyInit | null;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache */
  cache?: RequestCache;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials */
  credentials?: RequestCredentials;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/integrity */
  integrity?: string;
  keepalive?: boolean;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/mode */
  mode?: RequestMode;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/redirect */
  redirect?: RequestRedirect;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/referrer */
  referrer?: string;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Request/referrerPolicy */
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
}

/**
 * General response object whose properties is common in both XMLHttpRequest and fetch.
 */
export interface Response<T extends "xhr" | "fetch"> {
  /**
   * "xhr" or "fetch".
   *
   * When a request is generated by `XMLHttpRequest`, then ajaxType is "xhr".
   *
   * When a request is generated by `window.fetch`, then ajaxType is "fetch".
   */
  ajaxType: T;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/status */
  status: number;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/statusText */
  statusText: string;
  /**
   * Key-value pairs of a header.
   *
   * @example
   * ```js
   * {
   *   "Content-Type": "application/json; charset=utf-8",
   *   "X-API-Limit": 100
   * }
   * ```
   */
  headers: Record<string, string>;
  /**
   * A request body.
   *
   * BodyInit: Blob | BufferSource | FormData | URLSearchParams | ReadableStream\<Uint8Array\> | string
   */
  body?: T extends "xhr" ? BodyInit|null|Document|Record<string, unknown> : BodyInit | null;
}

/**
 * Request object properties only for `XMLHttpRequest`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/XMLHttpRequest
 */
export interface ResponseByXHR extends Response<"xhr"> {
  headers: Record<string, string>;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType */
  responseType: XMLHttpRequestResponseType;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response */
  response?: BodyInit | null | Document | Record<string, unknown>;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText */
  responseText?: string;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseXML */
  responseXML?: Document|null;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL */
  responseURL?: string;
}

/**
 * Response object properties only for `fetch`.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export interface ResponseByFetch extends Response<"fetch"> {
  /** @ignore */
  status: number;
  /** @ignore */
  statusText: string;
  headers: Record<string, string>;
  /**
   * Although original fetch response body is ReadableStream of Uint8Array,
   * you can specify value of body in various type like just a string.
   * 
   * @example
   * ```js
   * var response = {
   *   ...,
   *   body: "{\"key\":\"value\"}", // This will be converted to json after `response.json()` is called in user script.
   * };
   * ```
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Body/body
   */
  body: BodyInit | null;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/ok */
  ok: boolean;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/redirected */
  redirected: boolean;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/type */
  type: ResponseType;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/Response/url */
  url: string;
}
