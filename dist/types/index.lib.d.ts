export declare const IEVersion: number | boolean;
export declare function isIE(op?: "<" | "<=" | ">" | ">=" | "=", version?: number): boolean;
export declare const createEvent: (type: string) => Event;
export declare const toHeaderMap: (responseHeaders: string) => {
    [name: string]: string;
};
export declare const toHeaderString: (headerMap: {
    [name: string]: string;
}) => string;
export declare const makeProgressEvent: (type: string, loaded: number, lengthComputable?: boolean, total?: number) => ProgressEvent<XMLHttpRequestEventTarget>;
