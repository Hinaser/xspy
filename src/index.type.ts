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
  timeout: number;
  headers?: T extends "xhr" ? Record<string, string> : Headers | HeadersInit;
  body?: T extends "xhr" ? BodyInit | null | Document : BodyInit | null;
}

export interface XhrRequest extends TRequest<"xhr"> {
  async?: boolean;
  username?: string|null;
  password?: string|null;
  responseType?: XMLHttpRequestResponseType;
  withCredentials?: boolean;
  upload?: XMLHttpRequestUpload;
}

export interface FetchRequest extends TRequest<"fetch"> {
  method: string;
  url: string;
  headers?: Headers | HeadersInit;
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

export interface TResponse<T extends "xhr"|"fetch"> {
  ajaxType: T;
  status: number;
  statusText: string;
  headers: T extends "xhr" ? Record<string, string> : HeadersInit | Headers;
  body?: T extends "xhr" ? BodyInit | null | Document : ReadableStream<Uint8Array> | null;
}

export interface XhrResponse extends TResponse<"xhr"> {
  headers: Record<string, string>;
  responseType: XMLHttpRequestResponseType;
  response?: BodyInit | null | Document;
  responseText?: string;
  responseXML?: Document|null;
  responseURL?: string;
}

export interface FetchResponse extends TResponse<"fetch"> {
  headers: HeadersInit | Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  trailer: Promise<Headers>;
  type: ResponseType;
  url: string;
  clone(): Response;
  body: ReadableStream<Uint8Array> | null;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  text(): Promise<string>;
}
