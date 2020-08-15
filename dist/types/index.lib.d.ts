import { ProgressEventExt } from "./modules/ProgressEvent";
export declare const IEVersion: number | boolean;
export declare function isIE(op?: "<" | "<=" | ">" | ">=" | "=", version?: number): boolean;
export declare const toHeaderMap: (responseHeaders: string) => {
    [name: string]: string;
};
export declare const toHeaderString: (headerMap: {
    [name: string]: string;
}) => string;
export declare const createXHREvent: (type: string, xhr: XMLHttpRequest, bubbles: boolean) => Event;
export declare const makeProgressEvent: (type: string, xhr: XMLHttpRequest, bubbles: boolean, lengthComputable: boolean | undefined, loaded: number, total?: number) => ProgressEventExt<XMLHttpRequestEventTarget>;
