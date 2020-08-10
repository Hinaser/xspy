import { RequestHandler, ResponseHandler, WindowEx } from "./index.type";
declare let window: WindowEx;
export declare class Proxy {
    private static _reqListeners;
    private static _resListeners;
    private static _customXHR;
    private static _customFetch;
    static readonly OriginalXHR: new () => XMLHttpRequest;
    static readonly OriginalFetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
    static enable(): void;
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
