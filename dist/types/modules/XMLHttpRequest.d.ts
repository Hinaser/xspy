export declare class XHRProxy implements XMLHttpRequest {
    static readonly UNSENT: number;
    static readonly OPENED: number;
    static readonly HEADERS_RECEIVED: number;
    static readonly LOADING: number;
    static readonly DONE: number;
    readonly UNSENT: number;
    readonly OPENED: number;
    readonly HEADERS_RECEIVED: number;
    readonly LOADING: number;
    readonly DONE: number;
    private _xhr;
    private _listeners;
    private _readyState;
    private _isAborted;
    private _hasError;
    private _transitioning;
    private _request;
    private _response;
    private _responseText;
    private _responseXML;
    readyState: number;
    status: number;
    statusText: string;
    timeout: number;
    readonly upload: XMLHttpRequestUpload;
    response: BodyInit | Document | null | undefined;
    responseType: XMLHttpRequestResponseType;
    responseURL: string;
    get responseText(): string;
    get responseXML(): Document | null;
    withCredentials: boolean;
    onreadystatechange: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onabort: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onerror: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onloadstart: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onload: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onloadend: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    ontimeout: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    onprogress: ((this: XMLHttpRequest, ev: Event) => unknown) | null;
    constructor();
    private _init;
    addEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: Event | ProgressEvent<XMLHttpRequestEventTarget>) => unknown, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof XMLHttpRequestEventMap>(type: K, listener: (this: XMLHttpRequest, ev: Event | ProgressEvent<XMLHttpRequestEventTarget>) => any, options?: boolean | EventListenerOptions): void;
    dispatchEvent(event: Event | ProgressEvent<XMLHttpRequestEventTarget>): boolean;
    overrideMimeType(mime: string): void;
    open(method: string, url: string, async?: boolean, username?: string | null, password?: string | null): void;
    send(body?: Document | BodyInit | null): void;
    setRequestHeader(name: string, value: string): void;
    getResponseHeader(name: string): string | null;
    getAllResponseHeaders(): string;
    abort(): void;
    private static _createRequest;
    private static _createResponse;
    private _setupVirtualRequestForSending;
    private _syncEventListenersToXHR;
    private _createRequestCallback;
    private _createResponseCallback;
    private _loadHeaderFromXHRToVirtualResponse;
    private _loadBodyFromXHRToVirtualResponse;
    private _syncHeaderFromVirtualResponse;
    private _syncBodyFromVirtualResponse;
    private _onError;
    private _triggerStateAction;
    private _runUntil;
}
