export type EventType = "request" | "response";
export type RequestCallback = {
  (dummyResponse: TResponse): unknown;
  moveToHeaderReceived: (dummyResponse: TResponse) => void;
  moveToLoading: (dummyResponse: TResponse) => void;
};
export type RequestHandler = (this: XMLHttpRequest, request: TRequest, callback?: RequestCallback) => unknown;
export type ResponseHandler = (this: XMLHttpRequest, request: TRequest, response: TResponse) => unknown;

export type TRequest = {
  xhr: XMLHttpRequest;
  status: number;
  method: string;
  url: string;
  headers: { [name: string]: string };
  async?: boolean;
  username?: string|null;
  password?: string|null;
  responseType?: XMLHttpRequestResponseType;
  timeout: number;
  withCredentials?: boolean;
  body?: Document | BodyInit | null;
  upload?: XMLHttpRequestUpload;
};

export type TResponse = {
  status: number;
  statusText: string;
  finalUrl: string;
  headers: { [name: string]: string };
  text?: string;
  data?: Document|string|null;
  xml?: Document|null;
};