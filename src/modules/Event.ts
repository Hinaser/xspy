const timeOffset = Date.now();

export interface EventInitExt<T extends EventTarget = EventTarget> extends EventInit {
  target: T | null;
  bubbles: boolean;
  path: EventTarget[];
  eventPhase: number;
}

export class EventExt<T extends EventTarget = EventTarget> implements Event {
  private _bubbles: boolean = false;
  private _cancelBubble: boolean = false;
  private _cancelable: boolean = false;
  private _composed: boolean = false;
  private _defaultPrevented: boolean = false;
  private _path: EventTarget[] = [];
  private _eventPhase: number = 0;
  private _returnValue: boolean = true;
  private _timeStamp: number;
  private _type: string = "";
  private _target: T | null = null;
  private _currentTarget: T | null = null;
  private _srcElement: T | null = null;
  private _isTrusted: boolean = true;
  
  public readonly NONE: number = 0;
  public readonly CAPTURING_PHASE: number = 1;
  public readonly AT_TARGET: number = 2;
  public readonly BUBBLING_PHASE: number = 3;
  
  public get bubbles() { return this._bubbles; }
  public get cancelBubble() { return this._cancelBubble; }
  public get cancelable() { return this._cancelable; }
  public get composed() { return this._composed; }
  public get defaultPrevented() { return this._defaultPrevented; }
  public get eventPhase() { return this._eventPhase; }
  public get returnValue() { return this._returnValue; }
  public get timeStamp() { return this._timeStamp; }
  public get type() { return this._type; }
  public get target() { return this._target; }
  public get currentTarget() { return this._currentTarget; }
  // Ignore srcElement() from test for coverage because it is deprecated. (Some vendors left its implementation)
  /* istanbul ignore next */
  public get srcElement() { return this._srcElement; }
  public get isTrusted() { return this._isTrusted; }
  
  public constructor(type: string, init: EventInitExt<T>) {
    this._timeStamp = Date.now() - timeOffset;
    this._type = type;
  
    this._bubbles = init.bubbles;
    this._path = init.path;
    this._eventPhase = init.eventPhase;
    this._target = init.target;
    this._currentTarget = init.target;
    this._srcElement = init.target;
  }
  
  // composedPath() behaves differently in chrome/ff/ie. So skip test for coverage.
  /* istanbul ignore next */
  public composedPath(): EventTarget[] {
    return this._path;
  }
  
  // Skip test for coverage because `initEvent` is deprecated.
  /* istanbul ignore next */
  public initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    this._type = type;
    if(typeof bubbles !== "undefined"){
      this._bubbles = bubbles;
    }
    if(typeof cancelable !== "undefined"){
      this._cancelable = cancelable;
    }
  }
  
  public preventDefault(): void {
    return;
  }
  
  public stopImmediatePropagation(): void {
    this._cancelBubble = true;
    return;
  }
  
  public stopPropagation(): void {
    return;
  }
}
