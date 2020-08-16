import { RequestHandler, ResponseHandler } from "./index.type";
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
 * When loading into browser, static class `XSpy` is available by calling `window.xspy` or just `xspy`.
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
     */
    static readonly OriginalXHR: new () => XMLHttpRequest;
    /**
     * Original fetch.
     * window.fetch will be replaced to customized fetch on `xspy.enable()` called.
     * Regardless of whether `xspy.enable()` called, `xspy.OriginalFetch` always returns original fetch.
     */
    static readonly OriginalFetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    /**
     * Start to listen request/response from XMLHttpRequest/fetch.
     * Request/Response hook is enabled by replacing `XMLHttpRequest` and `window.fetch` to the ones in this library.
     *
     * Note: This does not polyfill `window.fetch` for Internet Explorer which does not originally implement `window.fetch`.
     */
    static enable(): void;
    /**
     *
     */
    static disable(): void;
    static isEnabled(): boolean;
    static setXMLHttpRequest(m: typeof window["XMLHttpRequest"]): void;
    static setFetch(m: typeof window["fetch"]): void;
    static getRequestListeners(): RequestHandler<"xhr" | "fetch">[];
    static getResponseListeners(): ResponseHandler<"xhr" | "fetch">[];
    static onRequest(listener: RequestHandler<"xhr" | "fetch">, n?: number): void;
    static offRequest(listener: RequestHandler<"xhr" | "fetch">): void;
    static onResponse(listener: ResponseHandler<"xhr" | "fetch">, n?: number): void;
    static offResponse(listener: ResponseHandler<"xhr" | "fetch">): void;
    static clearAll(): void;
    static clearRequestHandler(): void;
    static clearResponseHandler(): void;
    private static _removeEventListener;
}
export {};
