const timeOffset = Date.now();

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
  public get path() { return this._path; }
  public get eventPhase() { return this._eventPhase; }
  public get returnValue() { return this._returnValue; }
  public get timeStamp() { return this._timeStamp; }
  public get type() { return this._type; }
  public get target() { return this._target; }
  public get currentTarget() { return this._currentTarget; }
  public get srcElement() { return this._srcElement; }
  public get isTrusted() { return this._isTrusted; }
  
  public constructor(type: string, init?: EventInit, target?: T|null, isTrusted?: boolean) {
    this._timeStamp = Date.now() - timeOffset;
    this._type = type;
    
    if(typeof init !== "undefined"){
      if(typeof init.bubbles !== "undefined"){
        this._bubbles = init.bubbles;
      }
      if(typeof init.cancelable !== "undefined"){
        this._cancelBubble = init.cancelable;
      }
      if(typeof init.composed !== "undefined"){
        this._composed = init.composed;
      }
    }
    
    if(typeof target !== "undefined"){
      this._target = target;
      this._currentTarget = target;
      this._srcElement = target;
    }
    
    if(typeof isTrusted !== "undefined"){
      this._isTrusted = isTrusted;
    }
  }
  
  public composedPath(): EventTarget[] {
    return this._path;
  }
  
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
    this._defaultPrevented = true;
    return;
  }
  
  public stopImmediatePropagation(): void {
    return;
  }
  
  public stopPropagation(): void {
    return;
  }
}
