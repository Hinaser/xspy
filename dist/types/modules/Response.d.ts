export declare class ResponseProxy {
    private _response;
    private _body?;
    private _init?;
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    status: number;
    statusText: string;
    trailer: Promise<Headers>;
    type: ResponseType;
    url: string;
    body: ReadableStream<Uint8Array> | null;
    bodyUsed: boolean;
    constructor(body?: BodyInit | null, init?: ResponseInit);
    static error(): Response;
    static redirect(url: string, status?: number): Response;
    clone(): ResponseProxy;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
}
