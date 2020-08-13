import {EventExt} from "./modules/Event";
import {ProgressEventExt} from "./modules/ProgressEvent";

const userAgent = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "";

// If browser is not IE, IEVersion will be NaN
export const IEVersion = (() => {
  let version = parseInt((/msie (\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
  
  /* istanbul ignore else */
  if(isNaN(version)) {
    version = parseInt((/trident\/.*; rv:(\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
    /* istanbul ignore else */
    if(isNaN(version)){
      return false;
    }
    /* istanbul ignore next */
    return version;
  }
  
  /* istanbul ignore next */
  return version;
})();

/* istanbul ignore next */
export function isIE(op?: "<"|"<="|">"|">="|"=", version?: number){
  if(IEVersion === false) return false;
  else if(!version) return true;
  else if(op === "<") return IEVersion < version;
  else if(op === "<=") return IEVersion <= version;
  else if(op === ">") return IEVersion > version;
  else if(op === ">=") return IEVersion >= version;
  else if(op === "=") return IEVersion === version;
  return IEVersion === version;
}

export const toHeaderMap = (responseHeaders: string) => {
  const headers = responseHeaders.trim().split(/[\r\n]+/)
  
  const map: {[name: string]: string} = {};
  for(let i=0;i<headers.length;i++){
    const line = headers[i];
    const parts = line.split(": ");
    const name = parts.shift();
    if(name){
      const lowerName = name.toLowerCase();
      map[lowerName] = parts.join(": ");
    }
  }
  
  return map;
}

export const toHeaderString = (headerMap: {[name: string]: string}) => {
  const headers: string[] = [];
  const keys = Object.keys(headerMap);
  
  for(let i=0;i<keys.length;i++){
    const key = keys[i];
    const name = key.toLowerCase();
    const value = headerMap[key];
    
    headers.push(name + ": " + value);
  }
  
  return headers.join("\r\n") + "\r\n";
};

export const createXHREvent = (type: string, xhr: XMLHttpRequest): Event => {
  return new EventExt(type, undefined, xhr, true);
};

export const makeProgressEvent = (type: string, xhr: XMLHttpRequest, loaded: number, lengthComputable: boolean = false, total: number = 0) => {
  return new ProgressEventExt<XMLHttpRequestEventTarget>(
    type,
    undefined,
    xhr,
    true,
    lengthComputable,
    loaded,
    total
  );
}
