import { EventExt, EventInitExt } from "./Event";
export interface ProgressEventInitExt<T extends EventTarget = EventTarget> extends EventInitExt<T> {
    lengthComputable: boolean;
    loaded: number;
    total: number;
}
export declare class ProgressEventExt<T extends EventTarget = EventTarget> extends EventExt {
    private _lengthComputable;
    private _loaded;
    private _total;
    get lengthComputable(): boolean;
    get loaded(): number;
    get total(): number;
    constructor(type: string, init: ProgressEventInitExt<T>);
}
