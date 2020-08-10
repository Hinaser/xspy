(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xspy"] = factory();
	else
		root["xspy"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Proxy.ts":
/*!**********************!*\
  !*** ./src/Proxy.ts ***!
  \**********************/
/*! exports provided: Proxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Proxy", function() { return Proxy; });
class Proxy {
    static enable() {
        window.XMLHttpRequest = Proxy._customXHR;
        /* istanbul ignore else */
        if (window.fetch) {
            window.fetch = Proxy._customFetch;
        }
    }
    static disable() {
        window.XMLHttpRequest = Proxy.OriginalXHR;
        /* istanbul ignore else */
        if (window.fetch && Proxy.OriginalFetch) {
            window.fetch = Proxy.OriginalFetch;
        }
    }
    static isEnabled() {
        return window.XMLHttpRequest === Proxy._customXHR;
    }
    static setXMLHttpRequest(m) {
        Proxy._customXHR = m;
    }
    static setFetch(m) {
        Proxy._customFetch = m;
    }
    static getRequestListeners() {
        const listeners = Proxy._reqListeners;
        return listeners.slice();
    }
    static getResponseListeners() {
        const listeners = Proxy._resListeners;
        return listeners.slice();
    }
    static onRequest(listener, n) {
        const listeners = this._reqListeners;
        if (listeners.indexOf(listener) > -1) {
            return;
        }
        if (typeof n === "number") {
            listeners.splice(n, 0, listener);
        }
        else {
            listeners.push(listener);
        }
    }
    static offRequest(listener) {
        this._removeEventListener("request", listener);
    }
    static onResponse(listener, n) {
        const listeners = this._resListeners;
        if (listeners.indexOf(listener) > -1) {
            return;
        }
        if (typeof n === "number") {
            listeners.splice(n, 0, listener);
        }
        else {
            listeners.push(listener);
        }
    }
    static offResponse(listener) {
        this._removeEventListener("response", listener);
    }
    static clearAll() {
        Proxy.clearRequestHandler();
        Proxy.clearResponseHandler();
    }
    static clearRequestHandler() {
        this._reqListeners = [];
    }
    static clearResponseHandler() {
        this._resListeners = [];
    }
    static _removeEventListener(type, listener) {
        const listeners = type === "request" ? this._reqListeners : this._resListeners;
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                return;
            }
        }
    }
}
Proxy._reqListeners = [];
Proxy._resListeners = [];
Proxy._customXHR = window.XMLHttpRequest;
Proxy._customFetch = window.fetch;
Proxy.OriginalXHR = window.XMLHttpRequest;
/* Only IE does not implement `window.fetch`. Exclude from coverage counting. */
/* istanbul ignore next */
Proxy.OriginalFetch = (window.fetch || function fetch() { return; }).bind(window);


/***/ }),

/***/ "./src/index.lib.ts":
/*!**************************!*\
  !*** ./src/index.lib.ts ***!
  \**************************/
/*! exports provided: IEVersion, isIE, createEvent, toHeaderMap, toHeaderString, makeProgressEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IEVersion", function() { return IEVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIE", function() { return isIE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEvent", function() { return createEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHeaderMap", function() { return toHeaderMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHeaderString", function() { return toHeaderString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeProgressEvent", function() { return makeProgressEvent; });
const userAgent = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "";
// If browser is not IE, IEVersion will be NaN
const IEVersion = (() => {
    let version = parseInt((/msie (\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
    /* istanbul ignore else */
    if (isNaN(version)) {
        version = parseInt((/trident\/.*; rv:(\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
        /* istanbul ignore else */
        if (isNaN(version)) {
            return false;
        }
        /* istanbul ignore next */
        return version;
    }
    /* istanbul ignore next */
    return version;
})();
/* istanbul ignore next */
function isIE(op, version) {
    if (IEVersion === false)
        return false;
    else if (!version)
        return true;
    else if (op === "<")
        return IEVersion < version;
    else if (op === "<=")
        return IEVersion <= version;
    else if (op === ">")
        return IEVersion > version;
    else if (op === ">=")
        return IEVersion >= version;
    else if (op === "=")
        return IEVersion === version;
    return IEVersion === version;
}
const createEvent = (type) => {
    try {
        /* istanbul ignore else */
        if (!isIE() && typeof Event !== "undefined") {
            return new Event(type);
        }
        // When browser is IE, `new Event()` will fail.
        /* istanbul ignore next */
        const ev = window.document.createEvent("Event");
        /* istanbul ignore next */
        ev.initEvent(type);
        /* istanbul ignore next */
        return ev;
    }
    catch (e) {
        /* istanbul ignore next */
        return {
            type,
        };
    }
};
const toHeaderMap = (responseHeaders) => {
    const headers = responseHeaders.trim().split(/[\r\n]+/);
    const map = {};
    for (let i = 0; i < headers.length; i++) {
        const line = headers[i];
        const parts = line.split(": ");
        const name = parts.shift();
        if (name) {
            const lowerName = name.toLowerCase();
            map[lowerName] = parts.join(": ");
        }
    }
    return map;
};
const toHeaderString = (headerMap) => {
    const headers = [];
    const keys = Object.keys(headerMap);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const name = key.toLowerCase();
        const value = headerMap[key];
        headers.push(name + ": " + value);
    }
    return headers.join("\r\n") + "\r\n";
};
const makeProgressEvent = (type, loaded, lengthComputable = false, total = 0) => {
    const ev = Object.assign(Object.assign({}, createEvent(type)), { type, target: null, loaded,
        lengthComputable,
        total });
    return ev;
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Proxy */ "./src/Proxy.ts");
/* harmony import */ var _modules_XMLHttpRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/XMLHttpRequest */ "./src/modules/XMLHttpRequest.ts");
/* harmony import */ var _modules_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/fetch */ "./src/modules/fetch.ts");



_Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].setXMLHttpRequest(_modules_XMLHttpRequest__WEBPACK_IMPORTED_MODULE_1__["XHRProxy"]);
_Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].setFetch(_modules_fetch__WEBPACK_IMPORTED_MODULE_2__["fetchProxy"]);
_Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].enable();
/* harmony default export */ __webpack_exports__["default"] = (_Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"]);


/***/ }),

/***/ "./src/modules/Response.ts":
/*!*********************************!*\
  !*** ./src/modules/Response.ts ***!
  \*********************************/
/*! exports provided: ResponseProxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResponseProxy", function() { return ResponseProxy; });
class ResponseProxy {
    constructor(body, init) {
        this._response = new Response(body, init);
        this._body = body;
        this._init = init;
        this.headers = new Headers(init ? init.headers : undefined);
        this.ok = false;
        this.redirected = false;
        this.status = init && init.status ? init.status : 0;
        this.statusText = init && init.statusText ? init.statusText : "";
        this.trailer = this._response.trailer;
        this.type = "basic";
        this.url = "";
        this.body = this._response.body;
        this.bodyUsed = this._response.bodyUsed;
    }
    static error() {
        return Response.error();
    }
    static redirect(url, status) {
        return Response.redirect(url, status);
    }
    clone() {
        return new ResponseProxy(this._body, this._init);
    }
    arrayBuffer() {
        return this._response.arrayBuffer();
    }
    blob() {
        return this._response.blob();
    }
    formData() {
        return this._response.formData();
    }
    json() {
        return this._response.json();
    }
    text() {
        return this._response.text();
    }
}


/***/ }),

/***/ "./src/modules/XMLHttpRequest.ts":
/*!***************************************!*\
  !*** ./src/modules/XMLHttpRequest.ts ***!
  \***************************************/
/*! exports provided: XHRProxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XHRProxy", function() { return XHRProxy; });
/* harmony import */ var _index_lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../index.lib */ "./src/index.lib.ts");
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Proxy */ "./src/Proxy.ts");


class XHRProxy {
    constructor() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;
        this._xhr = new _Proxy__WEBPACK_IMPORTED_MODULE_1__["Proxy"].OriginalXHR();
        this._listeners = {};
        this._readyState = 0;
        this._isAborted = false;
        this._hasError = null;
        this._transitioning = null;
        this._request = XHRProxy._createRequest(this._xhr);
        this._response = XHRProxy._createResponse();
        this._responseText = "";
        this._responseXML = null;
        this.readyState = 0;
        this.status = 0;
        this.statusText = "";
        this.timeout = 0;
        this.upload = this._xhr.upload;
        this.response = "";
        this.responseType = "";
        this.responseURL = "";
        this.withCredentials = false;
        this.onreadystatechange = null;
        this.onabort = null;
        this.onerror = null;
        this.onloadstart = null;
        this.onload = null;
        this.onloadend = null;
        this.ontimeout = null;
        this.onprogress = null;
        this._init();
    }
    get responseText() {
        if (this.responseType === "text" || this.responseType === "") {
            return this._responseText;
        }
        /* istanbul ignore next */
        else if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])(">=", 10)) {
            return this._responseText;
        }
        const e = new Error("responseText is only available if responseType is '' or 'text'.");
        e.name = "InvalidStateError";
        throw e;
    }
    get responseXML() {
        if (this.responseType === "document" || this.responseType === "") {
            return this._responseXML;
        }
        /* istanbul ignore next */
        else if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])(">=", 10)) {
            return this._responseXML;
        }
        const e = new Error("responseXML is only available if responseType is '' or 'document'.");
        e.name = "InvalidStateError";
        throw e;
    }
    _init() {
        this._onError = this._onError.bind(this);
        this._createRequestCallback = this._createRequestCallback.bind(this);
        const addEventListener = (type) => {
            this.addEventListener(type, this._onError);
        };
        addEventListener("error");
        addEventListener("timeout");
        addEventListener("abort");
        this._xhr.onreadystatechange = () => {
            // According to https://xhr.spec.whatwg.org/#the-abort()-method
            // onreadystatechange should not be called,
            // but some major browsers seems to call it actually.
            /*
            if(this._isAborted){
              return;
            }
            */
            const realReadyState = this._xhr.readyState;
            if (realReadyState === this.HEADERS_RECEIVED) {
                /* istanbul ignore if */
                if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])("<=", 9) && /* istanbul ignore next */ this._request.async === false) {
                    // For synchronous request in IE <= 9, it throws Error when accessing xhr header if readyState is less than LOADING.
                    // this._loadHeaderFromXHRToVirtualResponse();
                }
                else {
                    this._loadHeaderFromXHRToVirtualResponse();
                }
            }
            else if (realReadyState === this.LOADING) {
                this._loadHeaderFromXHRToVirtualResponse();
            }
            else if (realReadyState === this.DONE) {
                this._transitioning = false;
                this._loadHeaderFromXHRToVirtualResponse();
                this._loadBodyFromXHRToVirtualResponse();
            }
            this._runUntil(realReadyState);
        };
    }
    addEventListener(type, listener, options) {
        if (!this._listeners[type]) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    }
    removeEventListener(type, listener, options) {
        if (!this._listeners[type]) {
            return;
        }
        const index = this._listeners[type].indexOf(listener);
        if (index < 0) {
            return;
        }
        this._listeners[type].splice(index, 1);
    }
    dispatchEvent(event) {
        if (typeof event !== "object") {
            throw new TypeError("EventTarget.dispatchEvent: Argument 1 is not an object");
        }
        const onHandlerPropName = "on" + event.type;
        if (onHandlerPropName === "onabort"
            || onHandlerPropName === "onerror"
            || onHandlerPropName === "onload"
            || onHandlerPropName === "onloadend"
            || onHandlerPropName === "onloadstart"
            || onHandlerPropName === "onprogress"
            || onHandlerPropName === "ontimeout") {
            const handler = this[onHandlerPropName];
            if (handler) {
                handler.call(this, event);
            }
        }
        else if (onHandlerPropName === "onreadystatechange") {
            const handler = this[onHandlerPropName];
            if (handler) {
                handler.call(this, event);
            }
        }
        const listeners = this._listeners[event.type];
        if (!listeners) {
            return true;
        }
        for (let i = 0; i < listeners.length; i++) {
            const l = listeners[i];
            l.call(this, event);
        }
        return true;
    }
    overrideMimeType(mime) {
        return this._xhr.overrideMimeType.call(this._xhr, mime);
    }
    open(method, url, async, username, password) {
        if (arguments.length < 2) {
            throw new TypeError("XMLHttpRequest.open: " + arguments.length + " is not a valid argument count for any overload");
        }
        this._readyState = 0;
        this._hasError = false;
        this._isAborted = false;
        this._transitioning = false;
        this._request = Object.assign(Object.assign({}, XHRProxy._createRequest(this._xhr)), { headers: {}, method,
            url, async: async !== false, username,
            password });
        this._response = Object.assign(Object.assign({}, XHRProxy._createResponse()), { headers: {} });
        this._runUntil(this.OPENED);
    }
    send(body) {
        if (this._readyState !== this.OPENED) {
            throw new DOMException("XMLHttpRequest state must be OPENED");
        }
        this._setupVirtualRequestForSending(body);
        this._syncEventListenersToXHR();
        let isDispatchXHRSendCalled = false;
        const dispatchXHRSend = () => {
            isDispatchXHRSendCalled = true;
            // When requestCallback is used, readystate is automatically move forward to 'DONE'
            // and produce dummy response.
            if (this._readyState === this.DONE) {
                return;
            }
            this._transitioning = true;
            const async = this._request.async !== false;
            this._xhr.open(this._request.method, this._request.url, async, this._request.username, this._request.password);
            if (async) {
                this._xhr.responseType = this.responseType;
                this._xhr.timeout = this.timeout;
            }
            this._xhr.withCredentials = this.withCredentials;
            this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadstart", 0));
            const headerMap = this._request.headers;
            const headerNames = headerMap ? Object.keys(headerMap) : [];
            for (let i = 0; i < headerNames.length; i++) {
                const headerName = headerNames[i];
                const headerValue = headerMap[headerName];
                this._xhr.setRequestHeader(headerName, headerValue);
            }
            this._xhr.send(this._request.body);
        };
        const listeners = _Proxy__WEBPACK_IMPORTED_MODULE_1__["Proxy"].getRequestListeners();
        let listenerPointer = 0;
        const executeNextListener = () => {
            try {
                if (listenerPointer >= listeners.length) {
                    return dispatchXHRSend();
                }
                const l = listeners[listenerPointer];
                // l: (request, callback) => unknown
                if (l.length >= 2) {
                    const userCallback = this._createRequestCallback(() => {
                        listenerPointer++;
                        executeNextListener();
                    });
                    l.call(this, this._request, userCallback);
                    return;
                }
                // l: (request) => unknown
                l.call(this, this._request);
                listenerPointer++;
                executeNextListener();
            }
            catch (e) {
                console.warn("XMLHttpRequest: Exception in request handler", e);
                if (!isDispatchXHRSendCalled) {
                    listenerPointer++;
                    executeNextListener();
                }
            }
        };
        executeNextListener();
    }
    setRequestHeader(name, value) {
        if (this.readyState !== this.OPENED) {
            throw new DOMException("XMLHttpRequest state must be OPENED");
        }
        if (!this._request.headers) {
            this._request.headers = {};
        }
        const lowerName = name.toLowerCase();
        if (this._request.headers[lowerName]) {
            value = this._request.headers[lowerName] + ", " + value;
        }
        this._request.headers[lowerName] = value;
    }
    getResponseHeader(name) {
        const lowerHeaderName = name.toLowerCase();
        if (this.readyState < this.HEADERS_RECEIVED || !(lowerHeaderName in this._response.headers)) {
            // IE <= 9 throws Error when readyState is UNSENT
            /* istanbul ignore next */
            if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])("<=", 9)) {
                if (this.readyState < this.OPENED) {
                    throw new Error();
                }
                return "";
            }
            return null;
        }
        return this._response.headers[lowerHeaderName];
    }
    getAllResponseHeaders() {
        if (this.readyState < this.HEADERS_RECEIVED) {
            // According to MDN, getAllResponseHeaders returns null if headers are not yet received.
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
            // But lib.dom.d.ts asserts it always returns string.
            // Don't know which is correct.
            // IE <= 9 throws Error when readyState is UNSENT
            /* istanbul ignore next */
            if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])("<=", 9) && this.readyState < this.OPENED) {
                throw new Error();
            }
            return "";
        }
        return Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["toHeaderString"])(this._response.headers);
    }
    abort() {
        // According to https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests#Synchronous_request ,
        // it should throw an Error on abort() called when using synchronous request.
        // However, it actually does not in some major browser.
        /*
        if(this._request.async === false){
          throw new Error("Invalid access error");
        }
       */
        this._isAborted = true;
        this.status = 0;
        this.readyState = this.UNSENT;
        this._readyState = this.UNSENT;
        if (this._transitioning) {
            this._xhr.abort();
        }
        else {
            this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("abort", 0));
        }
        this._transitioning = false;
    }
    static _createRequest(xhr) {
        return {
            ajaxType: "xhr",
            headers: {},
            method: "GET",
            url: "",
            async: true,
            timeout: 0,
            upload: xhr.upload,
        };
    }
    static _createResponse() {
        return {
            ajaxType: "xhr",
            status: 0,
            statusText: "",
            finalUrl: "",
            responseType: "",
            headers: {},
        };
    }
    _setupVirtualRequestForSending(body) {
        this._request.responseType = this.responseType;
        this._request.timeout = this.timeout;
        this._request.withCredentials = this.withCredentials;
        this._request.body = body;
        this._xhr.onabort = typeof (this.onabort) === "function" ? this.onabort.bind(this) : null;
        this._xhr.onerror = typeof (this.onerror) === "function" ? this.onerror.bind(this) : null;
        this._xhr.ontimeout = typeof (this.ontimeout) === "function" ? this.ontimeout.bind(this) : null;
        this._xhr.onprogress = typeof (this.onprogress) === "function" ? this.onprogress.bind(this) : null;
    }
    _syncEventListenersToXHR() {
        const addEventListeners = (type) => {
            const localListeners = this._listeners[type];
            if (!localListeners || localListeners.length < 1) {
                return;
            }
            for (let i = 0; i < localListeners.length; i++) {
                this._xhr.addEventListener(type, localListeners[i].bind(this));
            }
        };
        addEventListeners("abort");
        addEventListeners("error");
        addEventListeners("timeout");
        addEventListeners("progress");
    }
    _createRequestCallback(onCalled) {
        const cb = (response) => {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadstart", 0));
            this._response = Object.assign(Object.assign({}, this._response), response);
            this._runUntil(this.DONE);
            onCalled();
        };
        const moveToHeaderReceived = (response) => {
            if (this.readyState >= this.HEADERS_RECEIVED) {
                return;
            }
            this._response = Object.assign(Object.assign({}, this._response), response);
            this._runUntil(this.HEADERS_RECEIVED);
        };
        const moveToLoading = (response) => {
            if (this.readyState >= this.LOADING) {
                return;
            }
            this._response = Object.assign(Object.assign({}, this._response), response);
            this._runUntil(this.LOADING);
        };
        cb.moveToHeaderReceived = moveToHeaderReceived;
        cb.moveToLoading = moveToLoading;
        return cb;
    }
    _createResponseCallback(onCalled) {
        return (response) => {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            this._response = Object.assign(Object.assign({}, this._response), response);
            onCalled();
        };
    }
    _loadHeaderFromXHRToVirtualResponse() {
        this._response.status = this._xhr.status;
        if (!this._isAborted) {
            this._response.statusText = this._xhr.statusText;
        }
        else {
            return;
        }
        const responseHeaders = this._xhr.getAllResponseHeaders();
        const headerMap = Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["toHeaderMap"])(responseHeaders);
        const keys = Object.keys(headerMap);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = headerMap[key];
            if (!this._response.headers[key]) {
                this._response.headers[key] = value;
            }
        }
    }
    _loadBodyFromXHRToVirtualResponse() {
        if (!this._xhr.responseType) {
            this._response.responseText = this._xhr.responseText;
            this._response.responseXML = this._xhr.responseXML;
            this._response.response = this._xhr.responseText;
        }
        else if (this._xhr.responseType === "text") {
            this._response.responseText = this._xhr.responseText;
            this._response.response = this._xhr.responseText;
        }
        else if (this._xhr.responseType === "document") {
            this._response.responseXML = this._xhr.responseXML;
            this._response.response = this._xhr.responseXML;
        }
        else {
            this._response.response = this._xhr.response;
        }
        if ("responseURL" in this._xhr) {
            this._response.responseURL = this._xhr.responseURL;
        }
    }
    _syncHeaderFromVirtualResponse() {
        this.status = this._response.status;
        this.statusText = this._response.statusText;
        // Response headers will be requested via getResponseHeader/getAllResponseHeaders
        // which get header values directly from this._response.
    }
    _syncBodyFromVirtualResponse() {
        if ("responseText" in this._response) {
            this._responseText = this._response.responseText || "";
        }
        if ("responseXML" in this._response) {
            this._responseXML = this._response.responseXML || null;
        }
        if ("body" in this._response) {
            this.response = this._response.body || null;
        }
        if ("response" in this._response) {
            this.response = this._response.response;
        }
        if ("responseURL" in this._response) {
            this.responseURL = this._response.responseURL || "";
        }
    }
    _onError() {
        this._hasError = true;
        this._readyState = this.UNSENT;
        this.readyState = this.UNSENT;
        this.status = 0;
    }
    _triggerStateAction() {
        const readyStateChangeEvent = Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["createEvent"])("readystatechange");
        if (this._readyState === this.OPENED) {
            this.dispatchEvent(readyStateChangeEvent);
        }
        else if (this._readyState === this.HEADERS_RECEIVED) {
            this._syncHeaderFromVirtualResponse();
            this.dispatchEvent(readyStateChangeEvent);
        }
        else if (this._readyState === this.LOADING) {
            this._syncHeaderFromVirtualResponse();
            this.dispatchEvent(readyStateChangeEvent);
        }
        else if (this._readyState === this.DONE) {
            this._syncHeaderFromVirtualResponse();
            this._syncBodyFromVirtualResponse();
            let isReturnResponseCalled = false;
            const returnResponse = () => {
                isReturnResponseCalled = true;
                // Re-sync for a case that this._request/this._response is modified in callback
                this._syncHeaderFromVirtualResponse();
                this._syncBodyFromVirtualResponse();
                this.dispatchEvent(readyStateChangeEvent);
                const emitLoadEvent = () => {
                    if (!this._hasError) {
                        this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("load", 0));
                    }
                    this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadend", 0));
                };
                if (this._request.async === false) {
                    emitLoadEvent();
                }
                else {
                    window.setTimeout(emitLoadEvent, 0);
                }
            };
            const listeners = _Proxy__WEBPACK_IMPORTED_MODULE_1__["Proxy"].getResponseListeners();
            let listenerPointer = 0;
            const executeNextListener = () => {
                try {
                    if (listenerPointer >= listeners.length) {
                        return returnResponse();
                    }
                    const l = listeners[listenerPointer];
                    // l: (request, response, callback) => unknown
                    if (l.length >= 3) {
                        const userCallback = this._createResponseCallback(() => {
                            listenerPointer++;
                            executeNextListener();
                        });
                        l.call(this, this._request, this._response, userCallback);
                        return;
                    }
                    // l: (request, response) => unknown
                    l.call(this, this._request, this._response);
                    listenerPointer++;
                    executeNextListener();
                }
                catch (e) {
                    console.warn("XMLHttpRequest: Exception in response handler", e);
                    if (!isReturnResponseCalled) {
                        listenerPointer++;
                        executeNextListener();
                    }
                }
            };
            executeNextListener();
        }
    }
    _runUntil(state) {
        while (this._readyState < state && this._readyState < this.DONE) {
            this._readyState++;
            this.readyState = this._readyState;
            this._triggerStateAction();
        }
    }
}
XHRProxy.UNSENT = 0;
XHRProxy.OPENED = 1;
XHRProxy.HEADERS_RECEIVED = 2;
XHRProxy.LOADING = 3;
XHRProxy.DONE = 4;


/***/ }),

/***/ "./src/modules/fetch.ts":
/*!******************************!*\
  !*** ./src/modules/fetch.ts ***!
  \******************************/
/*! exports provided: fetchProxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchProxy", function() { return fetchProxy; });
/* harmony import */ var _Proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Proxy */ "./src/Proxy.ts");
/* harmony import */ var _Response__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Response */ "./src/modules/Response.ts");


class FetchProxy {
    constructor(input, init) {
        this._input = input;
        this._init = init;
        this.dispatch = this.dispatch.bind(this);
        this._onResponse = this._onResponse.bind(this);
        this._createRequestCallback = this._createRequestCallback.bind(this);
        this._createResponseCallback = this._createResponseCallback.bind(this);
        this._request = FetchProxy._createRequest(input, init);
        this._response = FetchProxy._createResponse();
    }
    dispatch() {
        return new Promise((resolve, reject) => {
            const originalResponse = this._response;
            let isDispatchFetchCalled = false;
            const dispatchFetch = () => {
                isDispatchFetchCalled = true;
                if (originalResponse !== this._response) {
                    this._onResponse().then((response) => {
                        resolve(response);
                    });
                    return;
                }
                _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].OriginalFetch(this._request.url, this._request).then(response => {
                    const headers = {};
                    for (const key of response.headers.keys()) {
                        const value = response.headers.get(key);
                        if (value) {
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
            const requestListeners = _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].getRequestListeners();
            let listenerPointer = 0;
            const executeNextListener = () => {
                try {
                    if (listenerPointer >= requestListeners.length) {
                        return dispatchFetch();
                    }
                    const l = requestListeners[listenerPointer];
                    // l: (request, callback) => unknown
                    if (l.length >= 2) {
                        const userCallback = this._createRequestCallback(() => {
                            listenerPointer++;
                            executeNextListener();
                        });
                        l.call({}, this._request, userCallback);
                        return;
                    }
                    // l: (request) => unknown
                    l.call({}, this._request);
                    listenerPointer++;
                    executeNextListener();
                }
                catch (e) {
                    console.warn("XMLHttpRequest: Exception in request handler", e);
                    if (!isDispatchFetchCalled) {
                        listenerPointer++;
                        executeNextListener();
                    }
                }
            };
            executeNextListener();
        });
    }
    _onResponse() {
        return new Promise((resolve => {
            let isReturnResponseCalled = false;
            const returnResponse = () => {
                isReturnResponseCalled = true;
                const res = new _Response__WEBPACK_IMPORTED_MODULE_1__["ResponseProxy"](this._response.body, this._response);
                res.url = this._response.url;
                res.type = this._response.type;
                res.redirected = this._response.redirected;
                res.ok = this._response.ok;
                resolve(res);
            };
            const responseListeners = _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].getResponseListeners();
            let listenerPointer = 0;
            const executeNextListener = () => {
                try {
                    if (listenerPointer >= responseListeners.length) {
                        return returnResponse();
                    }
                    const l = responseListeners[listenerPointer];
                    // l: (request, response, callback) => unknown
                    if (l.length >= 3) {
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
                catch (e) {
                    console.warn("XMLHttpRequest: Exception in request handler", e);
                    if (!isReturnResponseCalled) {
                        listenerPointer++;
                        executeNextListener();
                    }
                }
            };
            executeNextListener();
        }));
    }
    static _createRequest(input, init) {
        if (typeof input === "string") {
            const req = Object.assign(Object.assign({}, (init || {})), { ajaxType: "fetch", headers: {}, url: input });
            if (init && init.headers) {
                const headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
                /**
                 * Webpack's es5 output for `for-of` loop over iterable does not work as expected as of 2020/08/08.
                 *
                 * for(const pair of headers.entries()){
                 *   ...
                 * }
                 *
                 * will be converted to
                 *
                 * for (var _i = 0, _a = headers.entries(); _i < _a.length; _i++) {
                 *   ...
                 * }
                 *
                 * Since headers.entries() returns not an array but iterable, `_a.length` is undefined.
                 * So the loop never run.
                 * As a work around, I convert iterable to an array as below.
                 */
                const entries = Array.from(headers.entries());
                for (let i = 0; i < entries.length; i++) {
                    const pair = entries[i];
                    const key = pair[0];
                    const value = pair[1];
                    if (value) {
                        req.headers[key] = value;
                    }
                }
            }
            return req;
        }
        else {
            const headers = input.headers || (init && init.headers ? init.headers : null);
            const req = Object.assign(Object.assign({}, (init || {})), { ajaxType: "fetch", method: input.method, url: input.url, timeout: 0, headers: {}, 
                // input.body may be `undefined` since major browsers does not support it as of 2020/08/06.
                // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#bcd:api.Request.Request
                body: input.body, cache: input.cache, credentials: input.credentials, integrity: input.integrity, keepalive: input.keepalive, mode: input.mode, redirect: input.redirect, referrer: input.referrer, referrerPolicy: input.referrerPolicy, signal: input.signal });
            if (headers) {
                const entries = Array.from(headers.entries());
                for (let i = 0; i < entries.length; i++) {
                    const pair = entries[i];
                    const key = pair[0];
                    const value = pair[1];
                    if (value) {
                        req.headers[key] = value;
                    }
                }
            }
            return req;
        }
    }
    static _createResponse() {
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
    _createRequestCallback(onCalled) {
        const cb = (response) => {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            this._response = response;
            onCalled();
        };
        cb.moveToHeaderReceived = () => { return; };
        cb.moveToLoading = () => { return; };
        return cb;
    }
    _createResponseCallback(onCalled) {
        return (response) => {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            this._response = response;
            onCalled();
        };
    }
}
function fetchProxy(input, init) {
    const fetch = new FetchProxy(input, init);
    return fetch.dispatch();
}


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=xspy.js.map