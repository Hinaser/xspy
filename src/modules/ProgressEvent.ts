import {EventExt, EventInitExt} from "./Event";

export interface ProgressEventInitExt<T extends EventTarget = EventTarget> extends EventInitExt<T> {
  lengthComputable: boolean,
  loaded: number,
  total: number,
}

export class ProgressEventExt<T extends EventTarget = EventTarget> extends EventExt {
  private _lengthComputable: boolean = true;
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
  
  public constructor(type: string, init: ProgressEventInitExt<T>){
    super(type, init);
  
    this._lengthComputable = init.lengthComputable;
    this._loaded = init.loaded;
    this._total = init.total;
  }
}