(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fetchXhrHook"] = factory();
	else
		root["fetchXhrHook"] = factory();
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
var Proxy = /** @class */ (function () {
    function Proxy() {
    }
    Proxy.enable = function () {
        window.XMLHttpRequest = Proxy._customXHR;
        /* istanbul ignore else */
        if (window.fetch) {
            window.fetch = Proxy._customFetch;
        }
    };
    Proxy.disable = function () {
        window.XMLHttpRequest = Proxy.OriginalXHR;
        /* istanbul ignore else */
        if (window.fetch && Proxy.OriginalFetch) {
            window.fetch = Proxy.OriginalFetch;
        }
    };
    Proxy.isEnabled = function () {
        return window.XMLHttpRequest === Proxy._customXHR;
    };
    Proxy.setXMLHttpRequest = function (m) {
        Proxy._customXHR = m;
    };
    Proxy.setFetch = function (m) {
        Proxy._customFetch = m;
    };
    Proxy.getRequestListeners = function () {
        var listeners = Proxy._reqListeners;
        return listeners.slice();
    };
    Proxy.getResponseListeners = function () {
        var listeners = Proxy._resListeners;
        return listeners.slice();
    };
    Proxy.onRequest = function (listener, n) {
        var listeners = this._reqListeners;
        if (listeners.indexOf(listener) > -1) {
            return;
        }
        if (typeof n === "number") {
            listeners.splice(n, 0, listener);
        }
        else {
            listeners.push(listener);
        }
    };
    Proxy.offRequest = function (listener) {
        this._removeEventListener("request", listener);
    };
    Proxy.onResponse = function (listener, n) {
        var listeners = this._resListeners;
        if (listeners.indexOf(listener) > -1) {
            return;
        }
        if (typeof n === "number") {
            listeners.splice(n, 0, listener);
        }
        else {
            listeners.push(listener);
        }
    };
    Proxy.offResponse = function (listener) {
        this._removeEventListener("response", listener);
    };
    Proxy.clearAll = function () {
        Proxy.clearRequestHandler();
        Proxy.clearResponseHandler();
    };
    Proxy.clearRequestHandler = function () {
        this._reqListeners = [];
    };
    Proxy.clearResponseHandler = function () {
        this._resListeners = [];
    };
    Proxy._removeEventListener = function (type, listener) {
        var listeners = type === "request" ? this._reqListeners : this._resListeners;
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] === listener) {
                listeners.splice(i, 1);
                return;
            }
        }
    };
    Proxy._reqListeners = [];
    Proxy._resListeners = [];
    Proxy._customXHR = window.XMLHttpRequest;
    Proxy._customFetch = window.fetch;
    Proxy.OriginalXHR = window.XMLHttpRequest;
    /* Only IE does not implement `window.fetch`. Exclude from coverage counting. */
    /* istanbul ignore next */
    Proxy.OriginalFetch = (window.fetch || function fetch() { return; }).bind(window);
    return Proxy;
}());



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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var userAgent = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "";
// If browser is not IE, IEVersion will be NaN
var IEVersion = (function () {
    var version = parseInt((/msie (\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
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
var createEvent = function (type) {
    try {
        /* istanbul ignore else */
        if (!isIE() && typeof Event !== "undefined") {
            return new Event(type);
        }
        // When browser is IE, `new Event()` will fail.
        /* istanbul ignore next */
        var ev = window.document.createEvent("Event");
        /* istanbul ignore next */
        ev.initEvent(type);
        /* istanbul ignore next */
        return ev;
    }
    catch (e) {
        /* istanbul ignore next */
        return {
            type: type,
        };
    }
};
var toHeaderMap = function (responseHeaders) {
    var headers = responseHeaders.trim().split(/[\r\n]+/);
    var map = {};
    for (var i = 0; i < headers.length; i++) {
        var line = headers[i];
        var parts = line.split(": ");
        var name = parts.shift();
        if (name) {
            var lowerName = name.toLowerCase();
            map[lowerName] = parts.join(": ");
        }
    }
    return map;
};
var toHeaderString = function (headerMap) {
    var headers = [];
    var keys = Object.keys(headerMap);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var name = key.toLowerCase();
        var value = headerMap[key];
        headers.push(name + ": " + value);
    }
    return headers.join("\r\n") + "\r\n";
};
var makeProgressEvent = function (type, loaded, lengthComputable, total) {
    if (lengthComputable === void 0) { lengthComputable = false; }
    if (total === void 0) { total = 0; }
    var ev = __assign(__assign({}, createEvent(type)), { type: type, target: null, loaded: loaded,
        lengthComputable: lengthComputable,
        total: total });
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
var ResponseProxy = /** @class */ (function () {
    function ResponseProxy(body, init) {
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
    ResponseProxy.error = function () {
        return Response.error();
    };
    ResponseProxy.redirect = function (url, status) {
        return Response.redirect(url, status);
    };
    ResponseProxy.prototype.clone = function () {
        return new ResponseProxy(this._body, this._init);
    };
    ResponseProxy.prototype.arrayBuffer = function () {
        return this._response.arrayBuffer();
    };
    ResponseProxy.prototype.blob = function () {
        return this._response.blob();
    };
    ResponseProxy.prototype.formData = function () {
        return this._response.formData();
    };
    ResponseProxy.prototype.json = function () {
        return this._response.json();
    };
    ResponseProxy.prototype.text = function () {
        return this._response.text();
    };
    return ResponseProxy;
}());



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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var XHRProxy = /** @class */ (function () {
    function XHRProxy() {
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
    Object.defineProperty(XHRProxy.prototype, "responseText", {
        get: function () {
            if (this.responseType === "text" || this.responseType === "") {
                return this._responseText;
            }
            /* istanbul ignore next */
            else if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])(">=", 10)) {
                return this._responseText;
            }
            var e = new Error("responseText is only available if responseType is '' or 'text'.");
            e.name = "InvalidStateError";
            throw e;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(XHRProxy.prototype, "responseXML", {
        get: function () {
            if (this.responseType === "document" || this.responseType === "") {
                return this._responseXML;
            }
            /* istanbul ignore next */
            else if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])(">=", 10)) {
                return this._responseXML;
            }
            var e = new Error("responseXML is only available if responseType is '' or 'document'.");
            e.name = "InvalidStateError";
            throw e;
        },
        enumerable: false,
        configurable: true
    });
    XHRProxy.prototype._init = function () {
        var _this = this;
        this._onError = this._onError.bind(this);
        this._createRequestCallback = this._createRequestCallback.bind(this);
        var addEventListener = function (type) {
            _this.addEventListener(type, _this._onError);
        };
        addEventListener("error");
        addEventListener("timeout");
        addEventListener("abort");
        this._xhr.onreadystatechange = function () {
            // According to https://xhr.spec.whatwg.org/#the-abort()-method
            // onreadystatechange should not be called,
            // but some major browsers seems to call it actually.
            /*
            if(this._isAborted){
              return;
            }
            */
            var realReadyState = _this._xhr.readyState;
            if (realReadyState === _this.HEADERS_RECEIVED) {
                /* istanbul ignore if */
                if (Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["isIE"])("<=", 9) && /* istanbul ignore next */ _this._request.async === false) {
                    // For synchronous request in IE <= 9, it throws Error when accessing xhr header if readyState is less than LOADING.
                    // this._loadHeaderFromXHRToVirtualResponse();
                }
                else {
                    _this._loadHeaderFromXHRToVirtualResponse();
                }
            }
            else if (realReadyState === _this.LOADING) {
                _this._loadHeaderFromXHRToVirtualResponse();
            }
            else if (realReadyState === _this.DONE) {
                _this._transitioning = false;
                _this._loadHeaderFromXHRToVirtualResponse();
                _this._loadBodyFromXHRToVirtualResponse();
            }
            _this._runUntil(realReadyState);
        };
    };
    XHRProxy.prototype.addEventListener = function (type, listener, options) {
        if (!this._listeners[type]) {
            this._listeners[type] = [];
        }
        this._listeners[type].push(listener);
    };
    XHRProxy.prototype.removeEventListener = function (type, listener, options) {
        if (!this._listeners[type]) {
            return;
        }
        var index = this._listeners[type].indexOf(listener);
        if (index < 0) {
            return;
        }
        this._listeners[type].splice(index, 1);
    };
    XHRProxy.prototype.dispatchEvent = function (event) {
        if (typeof event !== "object") {
            throw new TypeError("EventTarget.dispatchEvent: Argument 1 is not an object");
        }
        var onHandlerPropName = "on" + event.type;
        if (onHandlerPropName === "onabort"
            || onHandlerPropName === "onerror"
            || onHandlerPropName === "onload"
            || onHandlerPropName === "onloadend"
            || onHandlerPropName === "onloadstart"
            || onHandlerPropName === "onprogress"
            || onHandlerPropName === "ontimeout") {
            var handler = this[onHandlerPropName];
            if (handler) {
                handler.call(this, event);
            }
        }
        else if (onHandlerPropName === "onreadystatechange") {
            var handler = this[onHandlerPropName];
            if (handler) {
                handler.call(this, event);
            }
        }
        var listeners = this._listeners[event.type];
        if (!listeners) {
            return true;
        }
        for (var i = 0; i < listeners.length; i++) {
            var l = listeners[i];
            l.call(this, event);
        }
        return true;
    };
    XHRProxy.prototype.overrideMimeType = function (mime) {
        return this._xhr.overrideMimeType.call(this._xhr, mime);
    };
    XHRProxy.prototype.open = function (method, url, async, username, password) {
        if (arguments.length < 2) {
            throw new TypeError("XMLHttpRequest.open: " + arguments.length + " is not a valid argument count for any overload");
        }
        this._readyState = 0;
        this._hasError = false;
        this._isAborted = false;
        this._transitioning = false;
        this._request = __assign(__assign({}, XHRProxy._createRequest(this._xhr)), { headers: {}, method: method,
            url: url, async: async !== false, username: username,
            password: password });
        this._response = __assign(__assign({}, XHRProxy._createResponse()), { headers: {} });
        this._runUntil(this.OPENED);
    };
    XHRProxy.prototype.send = function (body) {
        var _this = this;
        if (this._readyState !== this.OPENED) {
            throw new DOMException("XMLHttpRequest state must be OPENED");
        }
        this._setupVirtualRequestForSending(body);
        this._syncEventListenersToXHR();
        var isDispatchXHRSendCalled = false;
        var dispatchXHRSend = function () {
            isDispatchXHRSendCalled = true;
            // When requestCallback is used, readystate is automatically move forward to 'DONE'
            // and produce dummy response.
            if (_this._readyState === _this.DONE) {
                return;
            }
            _this._transitioning = true;
            var async = _this._request.async !== false;
            _this._xhr.open(_this._request.method, _this._request.url, async, _this._request.username, _this._request.password);
            if (async) {
                _this._xhr.responseType = _this.responseType;
                _this._xhr.timeout = _this.timeout;
            }
            _this._xhr.withCredentials = _this.withCredentials;
            _this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadstart", 0));
            var headerMap = _this._request.headers;
            var headerNames = headerMap ? Object.keys(headerMap) : [];
            for (var i = 0; i < headerNames.length; i++) {
                var headerName = headerNames[i];
                var headerValue = headerMap[headerName];
                _this._xhr.setRequestHeader(headerName, headerValue);
            }
            _this._xhr.send(_this._request.body);
        };
        var listeners = _Proxy__WEBPACK_IMPORTED_MODULE_1__["Proxy"].getRequestListeners();
        var listenerPointer = 0;
        var executeNextListener = function () {
            try {
                if (listenerPointer >= listeners.length) {
                    return dispatchXHRSend();
                }
                var l = listeners[listenerPointer];
                // l: (request, callback) => unknown
                if (l.length >= 2) {
                    var userCallback = _this._createRequestCallback(function () {
                        listenerPointer++;
                        executeNextListener();
                    });
                    l.call(_this, _this._request, userCallback);
                    return;
                }
                // l: (request) => unknown
                l.call(_this, _this._request);
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
    };
    XHRProxy.prototype.setRequestHeader = function (name, value) {
        if (this.readyState !== this.OPENED) {
            throw new DOMException("XMLHttpRequest state must be OPENED");
        }
        if (!this._request.headers) {
            this._request.headers = {};
        }
        var lowerName = name.toLowerCase();
        if (this._request.headers[lowerName]) {
            value = this._request.headers[lowerName] + ", " + value;
        }
        this._request.headers[lowerName] = value;
    };
    XHRProxy.prototype.getResponseHeader = function (name) {
        var lowerHeaderName = name.toLowerCase();
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
    };
    XHRProxy.prototype.getAllResponseHeaders = function () {
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
    };
    XHRProxy.prototype.abort = function () {
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
    };
    XHRProxy._createRequest = function (xhr) {
        return {
            ajaxType: "xhr",
            headers: {},
            method: "GET",
            url: "",
            async: true,
            timeout: 0,
            upload: xhr.upload,
        };
    };
    XHRProxy._createResponse = function () {
        return {
            ajaxType: "xhr",
            status: 0,
            statusText: "",
            finalUrl: "",
            responseType: "",
            headers: {},
        };
    };
    XHRProxy.prototype._setupVirtualRequestForSending = function (body) {
        this._request.responseType = this.responseType;
        this._request.timeout = this.timeout;
        this._request.withCredentials = this.withCredentials;
        this._request.body = body;
        this._xhr.onabort = typeof (this.onabort) === "function" ? this.onabort.bind(this) : null;
        this._xhr.onerror = typeof (this.onerror) === "function" ? this.onerror.bind(this) : null;
        this._xhr.ontimeout = typeof (this.ontimeout) === "function" ? this.ontimeout.bind(this) : null;
        this._xhr.onprogress = typeof (this.onprogress) === "function" ? this.onprogress.bind(this) : null;
    };
    XHRProxy.prototype._syncEventListenersToXHR = function () {
        var _this = this;
        var addEventListeners = function (type) {
            var localListeners = _this._listeners[type];
            if (!localListeners || localListeners.length < 1) {
                return;
            }
            for (var i = 0; i < localListeners.length; i++) {
                _this._xhr.addEventListener(type, localListeners[i].bind(_this));
            }
        };
        addEventListeners("abort");
        addEventListeners("error");
        addEventListeners("timeout");
        addEventListeners("progress");
    };
    XHRProxy.prototype._createRequestCallback = function (onCalled) {
        var _this = this;
        var cb = function (response) {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            _this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadstart", 0));
            _this._response = __assign(__assign({}, _this._response), response);
            _this._runUntil(_this.DONE);
            onCalled();
        };
        var moveToHeaderReceived = function (response) {
            if (_this.readyState >= _this.HEADERS_RECEIVED) {
                return;
            }
            _this._response = __assign(__assign({}, _this._response), response);
            _this._runUntil(_this.HEADERS_RECEIVED);
        };
        var moveToLoading = function (response) {
            if (_this.readyState >= _this.LOADING) {
                return;
            }
            _this._response = __assign(__assign({}, _this._response), response);
            _this._runUntil(_this.LOADING);
        };
        cb.moveToHeaderReceived = moveToHeaderReceived;
        cb.moveToLoading = moveToLoading;
        return cb;
    };
    XHRProxy.prototype._createResponseCallback = function (onCalled) {
        var _this = this;
        return function (response) {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            _this._response = __assign(__assign({}, _this._response), response);
            onCalled();
        };
    };
    XHRProxy.prototype._loadHeaderFromXHRToVirtualResponse = function () {
        this._response.status = this._xhr.status;
        if (!this._isAborted) {
            this._response.statusText = this._xhr.statusText;
        }
        else {
            return;
        }
        var responseHeaders = this._xhr.getAllResponseHeaders();
        var headerMap = Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["toHeaderMap"])(responseHeaders);
        var keys = Object.keys(headerMap);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = headerMap[key];
            if (!this._response.headers[key]) {
                this._response.headers[key] = value;
            }
        }
    };
    XHRProxy.prototype._loadBodyFromXHRToVirtualResponse = function () {
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
    };
    XHRProxy.prototype._syncHeaderFromVirtualResponse = function () {
        this.status = this._response.status;
        this.statusText = this._response.statusText;
        // Response headers will be requested via getResponseHeader/getAllResponseHeaders
        // which get header values directly from this._response.
    };
    XHRProxy.prototype._syncBodyFromVirtualResponse = function () {
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
    };
    XHRProxy.prototype._onError = function () {
        this._hasError = true;
        this._readyState = this.UNSENT;
        this.readyState = this.UNSENT;
        this.status = 0;
    };
    XHRProxy.prototype._triggerStateAction = function () {
        var _this = this;
        var readyStateChangeEvent = Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["createEvent"])("readystatechange");
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
            var isReturnResponseCalled_1 = false;
            var returnResponse_1 = function () {
                isReturnResponseCalled_1 = true;
                // Re-sync for a case that this._request/this._response is modified in callback
                _this._syncHeaderFromVirtualResponse();
                _this._syncBodyFromVirtualResponse();
                _this.dispatchEvent(readyStateChangeEvent);
                var emitLoadEvent = function () {
                    if (!_this._hasError) {
                        _this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("load", 0));
                    }
                    _this.dispatchEvent(Object(_index_lib__WEBPACK_IMPORTED_MODULE_0__["makeProgressEvent"])("loadend", 0));
                };
                if (_this._request.async === false) {
                    emitLoadEvent();
                }
                else {
                    window.setTimeout(emitLoadEvent, 0);
                }
            };
            var listeners_1 = _Proxy__WEBPACK_IMPORTED_MODULE_1__["Proxy"].getResponseListeners();
            var listenerPointer_1 = 0;
            var executeNextListener_1 = function () {
                try {
                    if (listenerPointer_1 >= listeners_1.length) {
                        return returnResponse_1();
                    }
                    var l = listeners_1[listenerPointer_1];
                    // l: (request, response, callback) => unknown
                    if (l.length >= 3) {
                        var userCallback = _this._createResponseCallback(function () {
                            listenerPointer_1++;
                            executeNextListener_1();
                        });
                        l.call(_this, _this._request, _this._response, userCallback);
                        return;
                    }
                    // l: (request, response) => unknown
                    l.call(_this, _this._request, _this._response);
                    listenerPointer_1++;
                    executeNextListener_1();
                }
                catch (e) {
                    console.warn("XMLHttpRequest: Exception in response handler", e);
                    if (!isReturnResponseCalled_1) {
                        listenerPointer_1++;
                        executeNextListener_1();
                    }
                }
            };
            executeNextListener_1();
        }
    };
    XHRProxy.prototype._runUntil = function (state) {
        while (this._readyState < state && this._readyState < this.DONE) {
            this._readyState++;
            this.readyState = this._readyState;
            this._triggerStateAction();
        }
    };
    XHRProxy.UNSENT = 0;
    XHRProxy.OPENED = 1;
    XHRProxy.HEADERS_RECEIVED = 2;
    XHRProxy.LOADING = 3;
    XHRProxy.DONE = 4;
    return XHRProxy;
}());



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
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var FetchProxy = /** @class */ (function () {
    function FetchProxy(input, init) {
        this._input = input;
        this._init = init;
        this.dispatch = this.dispatch.bind(this);
        this._onResponse = this._onResponse.bind(this);
        this._createRequestCallback = this._createRequestCallback.bind(this);
        this._createResponseCallback = this._createResponseCallback.bind(this);
        this._request = FetchProxy._createRequest(input, init);
        this._response = FetchProxy._createResponse();
    }
    FetchProxy.prototype.dispatch = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var originalResponse = _this._response;
            var isDispatchFetchCalled = false;
            var dispatchFetch = function () {
                isDispatchFetchCalled = true;
                if (originalResponse !== _this._response) {
                    _this._onResponse().then(function (response) {
                        resolve(response);
                    });
                    return;
                }
                _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].OriginalFetch(_this._request.url, _this._request).then(function (response) {
                    var headers = {};
                    for (var _i = 0, _a = response.headers.keys(); _i < _a.length; _i++) {
                        var key = _a[_i];
                        var value = response.headers.get(key);
                        if (value) {
                            headers[key] = value;
                        }
                    }
                    _this._response = {
                        ajaxType: "fetch",
                        status: response.status,
                        statusText: response.statusText,
                        headers: headers,
                        ok: response.ok,
                        redirected: response.redirected,
                        type: response.type,
                        url: response.url,
                        body: response.body,
                    };
                    _this._onResponse().then(function (r) {
                        resolve(r);
                    });
                });
            };
            var requestListeners = _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].getRequestListeners();
            var listenerPointer = 0;
            var executeNextListener = function () {
                try {
                    if (listenerPointer >= requestListeners.length) {
                        return dispatchFetch();
                    }
                    var l = requestListeners[listenerPointer];
                    // l: (request, callback) => unknown
                    if (l.length >= 2) {
                        var userCallback = _this._createRequestCallback(function () {
                            listenerPointer++;
                            executeNextListener();
                        });
                        l.call({}, _this._request, userCallback);
                        return;
                    }
                    // l: (request) => unknown
                    l.call({}, _this._request);
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
    };
    FetchProxy.prototype._onResponse = function () {
        var _this = this;
        return new Promise((function (resolve) {
            var isReturnResponseCalled = false;
            var returnResponse = function () {
                isReturnResponseCalled = true;
                var res = new _Response__WEBPACK_IMPORTED_MODULE_1__["ResponseProxy"](_this._response.body, _this._response);
                res.url = _this._response.url;
                res.type = _this._response.type;
                res.redirected = _this._response.redirected;
                res.ok = _this._response.ok;
                resolve(res);
            };
            var responseListeners = _Proxy__WEBPACK_IMPORTED_MODULE_0__["Proxy"].getResponseListeners();
            var listenerPointer = 0;
            var executeNextListener = function () {
                try {
                    if (listenerPointer >= responseListeners.length) {
                        return returnResponse();
                    }
                    var l = responseListeners[listenerPointer];
                    // l: (request, response, callback) => unknown
                    if (l.length >= 3) {
                        var userCallback = _this._createResponseCallback(function () {
                            listenerPointer++;
                            executeNextListener();
                        });
                        l.call({}, _this._request, _this._response, userCallback);
                        return;
                    }
                    // l: (request, response) => unknown
                    l.call({}, _this._request, _this._response);
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
    };
    FetchProxy._createRequest = function (input, init) {
        if (typeof input === "string") {
            var req = __assign(__assign({}, (init || {})), { ajaxType: "fetch", headers: {}, url: input });
            if (init && init.headers) {
                var headers = init.headers instanceof Headers ? init.headers : new Headers(init.headers);
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
                var entries = Array.from(headers.entries());
                for (var i = 0; i < entries.length; i++) {
                    var pair = entries[i];
                    var key = pair[0];
                    var value = pair[1];
                    if (value) {
                        req.headers[key] = value;
                    }
                }
            }
            return req;
        }
        else {
            var headers = input.headers || (init && init.headers ? init.headers : null);
            var req = __assign(__assign({}, (init || {})), { ajaxType: "fetch", method: input.method, url: input.url, timeout: 0, headers: {}, 
                // input.body may be `undefined` since major browsers does not support it as of 2020/08/06.
                // https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#bcd:api.Request.Request
                body: input.body, cache: input.cache, credentials: input.credentials, integrity: input.integrity, keepalive: input.keepalive, mode: input.mode, redirect: input.redirect, referrer: input.referrer, referrerPolicy: input.referrerPolicy, signal: input.signal });
            if (headers) {
                var entries = Array.from(headers.entries());
                for (var i = 0; i < entries.length; i++) {
                    var pair = entries[i];
                    var key = pair[0];
                    var value = pair[1];
                    if (value) {
                        req.headers[key] = value;
                    }
                }
            }
            return req;
        }
    };
    FetchProxy._createResponse = function () {
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
    };
    FetchProxy.prototype._createRequestCallback = function (onCalled) {
        var _this = this;
        var cb = function (response) {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            _this._response = response;
            onCalled();
        };
        cb.moveToHeaderReceived = function () { return; };
        cb.moveToLoading = function () { return; };
        return cb;
    };
    FetchProxy.prototype._createResponseCallback = function (onCalled) {
        var _this = this;
        return function (response) {
            if (!response || typeof response !== "object") {
                onCalled();
                return;
            }
            _this._response = response;
            onCalled();
        };
    };
    return FetchProxy;
}());
function fetchProxy(input, init) {
    var fetch = new FetchProxy(input, init);
    return fetch.dispatch();
}


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=fetch-xhr-hook.es5.js.map