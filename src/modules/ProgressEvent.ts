import {EventExt} from "./Event";

export class ProgressEventExt<T extends EventTarget = EventTarget> extends EventExt {
  private _lengthComputable: boolean = false;
  private _loaded: number = 0;
  private _total: number = 0;
  
  public get lengthComputable() {
    return this._lengthComputable;
  }
  
  public get loaded() {
    return this._loaded;
  }
  
  public get total() {
    return this._total;
  }
  
  public constructor(
    type: string,
    init?: EventInit,
    target?: T | null,
    isTrusted?: boolean,
    lengthComputable?: boolean,
    loaded?: number,
    total?: number,
  ) {
    super(type, init, target, isTrusted);
    
    if (typeof lengthComputable !== "undefined") {
      this._lengthComputable = lengthComputable;
    }
    if (typeof loaded !== "undefined") {
      this._loaded = loaded;
    }
    if (typeof total !== "undefined") {
      this._total = total;
    }
  }
}