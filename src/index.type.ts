import {Proxy} from "./Proxy";

export interface WindowEx extends Window {
  XMLHttpRequest: new() => XMLHttpRequest;
  fetchXhrHook: typeof Proxy;
}

export type EventType = "request" | "response";
export type RequestCallback<T extends "xhr"|"fetch"> = {
  (dummyResponse: TResponse<T>): unknown;
  moveToHeaderReceived: (dummyResponse: TResponse<T>) => void;
  moveToLoading: (dummyResponse: TResponse<T>) => void;
};
export type RequestHandler<T extends "xhr"|"fetch"> = (
  this: T extends "xhr" ? XMLHttpRequest : unknown,
  request: T extends "xhr" ? XhrRequest : FetchRequest,
  callback?: RequestCallback<T>
) => unknown;
export type ResponseHandler<T extends "xhr"|"fetch"> = (
  this: T extends "xhr" ? XMLHttpRequest : unknown,
  request: T extends "xhr" ? XhrRequest : FetchRequest,
  response: T extends "xhr" ? XhrResponse : FetchResponse,
  callback?: ResponseCallback<T>
) => unknown;

export type ResponseCallback<T extends "xhr"|"fetch">
  = (dummyResponse: T extends "xhr" ? XhrResponse : FetchResponse) => unknown;

export interface TRequest<T extends "xhr"|"fetch"> {
  ajaxType: T;
  method: string;
  url: string;
  headers: T extends "xhr" ? Record<string, string> : Headers;
  timeout: number;
  body?: T extends "xhr" ? BodyInit | null | Document : ReadableStream<Uint8Array> | null;
}

export interface XhrRequest extends TRequest<"xhr"> {
  async?: boolean;
  username?: string|null;
  password?: string|null;
  responseType?: XMLHttpRequestResponseType;
  withCredentials?: boolean;
  upload?: XMLHttpRequestUpload;
}

export interface FetchRequest extends TRequest<"fetch">, Request {
  body: ReadableStream<Uint8Array> | null;
  headers: Headers;
  method: string;
  url: string;
}

export interface TResponse<T extends "xhr"|"fetch"> {
  ajaxType: T;
  status: number;
  statusText: string;
}

export interface XhrResponse extends TResponse<"xhr"> {
  headers: Record<string, string>;
  responseType: XMLHttpRequestResponseType;
  response?: Document|string|null;
  responseText?: string;
  responseXML?: Document|null;
  responseURL?: string;
}

export interface FetchResponse extends TResponse<"fetch">, Response {
  status: number;
  statusText: string;
}
