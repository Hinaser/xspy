export interface EventInitExt<T extends EventTarget = EventTarget> extends EventInit {
    target: T | null;
    bubbles: boolean;
    path: EventTarget[];
    eventPhase: number;
}
export declare class EventExt<T extends EventTarget = EventTarget> implements Event {
    private _bubbles;
    private _cancelBubble;
    private _cancelable;
    private _composed;
    private _defaultPrevented;
    private _path;
    private _eventPhase;
    private _returnValue;
    private _timeStamp;
    private _type;
    private _target;
    private _currentTarget;
    private _srcElement;
    private _isTrusted;
    readonly NONE: number;
    readonly CAPTURING_PHASE: number;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    get bubbles(): boolean;
    get cancelBubble(): boolean;
    get cancelable(): boolean;
    get composed(): boolean;
    get defaultPrevented(): boolean;
    get eventPhase(): number;
    get returnValue(): boolean;
    get timeStamp(): number;
    get type(): string;
    get target(): T | null;
    get currentTarget(): T | null;
    get srcElement(): T | null;
    get isTrusted(): boolean;
    constructor(type: string, init: EventInitExt<T>);
    composedPath(): EventTarget[];
    initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
    preventDefault(): void;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
}
