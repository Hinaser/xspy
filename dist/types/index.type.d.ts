import { Proxy } from "./Proxy";
export interface WindowEx extends Window {
    XMLHttpRequest: new () => XMLHttpRequest;
    fetchXhrHook: typeof Proxy;
}
export declare type EventType = "request" | "response";
export declare type RequestCallback<T extends "xhr" | "fetch"> = {
    (dummyResponse: TResponse<T>): unknown;
    moveToHeaderReceived: (dummyResponse: TResponse<T>) => void;
    moveToLoading: (dummyResponse: TResponse<T>) => void;
};
export declare type RequestHandler<T extends "xhr" | "fetch"> = (this: T extends "xhr" ? XMLHttpRequest : unknown, request: T extends "xhr" ? XhrRequest : FetchRequest, callback?: RequestCallback<T>) => unknown;
export declare type ResponseHandler<T extends "xhr" | "fetch"> = (this: T extends "xhr" ? XMLHttpRequest : unknown, request: T extends "xhr" ? XhrRequest : FetchRequest, response: T extends "xhr" ? XhrResponse : FetchResponse, callback?: ResponseCallback<T>) => unknown;
export declare type ResponseCallback<T extends "xhr" | "fetch"> = (dummyResponse: T extends "xhr" ? XhrResponse : FetchResponse) => unknown;
export interface TRequest<T extends "xhr" | "fetch"> {
    ajaxType: T;
    method: string;
    url: string;
    timeout: number;
    headers: Record<string, string>;
    body?: T extends "xhr" ? BodyInit | null | Document : BodyInit | null;
}
export interface XhrRequest extends TRequest<"xhr"> {
    async?: boolean;
    username?: string | null;
    password?: string | null;
    responseType?: XMLHttpRequestResponseType;
    withCredentials?: boolean;
    upload?: XMLHttpRequestUpload;
}
export interface FetchRequest extends TRequest<"fetch"> {
    method: string;
    url: string;
    body?: BodyInit | null;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    integrity?: string;
    keepalive?: boolean;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal | null;
}
export interface TResponse<T extends "xhr" | "fetch"> {
    ajaxType: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body?: T extends "xhr" ? BodyInit | null | Document : BodyInit | null;
}
export interface XhrResponse extends TResponse<"xhr"> {
    headers: Record<string, string>;
    responseType: XMLHttpRequestResponseType;
    response?: BodyInit | null | Document;
    responseText?: string;
    responseXML?: Document | null;
    responseURL?: string;
}
export interface FetchResponse extends TResponse<"fetch"> {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: BodyInit | null;
    ok: boolean;
    redirected: boolean;
    type: ResponseType;
    url: string;
}
