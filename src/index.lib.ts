const userAgent = typeof navigator !== "undefined" && navigator.userAgent ? navigator.userAgent : "";

// If browser is not IE, IEVersion will be NaN
export const IEVersion = (() => {
  const version = parseInt((/msie (\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
  
  /* istanbul ignore else */
  if (isNaN(version)) {
    return parseInt((/trident\/.*; rv:(\d+)/.exec(userAgent.toLowerCase()) || [])[1], 10);
  }
  
  /* istanbul ignore next */
  return version;
})();

export const createEvent = (type: string): Event => {
  try{
    /* istanbul ignore else */
    if(isNaN(IEVersion) && typeof Event !== "undefined"){
      return new Event(type);
    }
    
    // When browser is IE, new Event will fail.
    /* istanbul ignore next */
    const ev = window.document.createEvent("Event");
    /* istanbul ignore next */
    ev.initEvent(type);
    /* istanbul ignore next */
    return ev;
  }
  catch(e){
    /* istanbul ignore next */
    return {
      type,
    } as Event;
  }
};

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

export const makeProgressEvent = (type: string, loaded: number, lengthComputable: boolean = false, total: number = 0) => {
  const ev: ProgressEvent<XMLHttpRequestEventTarget> = {
    ...createEvent(type),
    type,
    target: null,
    loaded,
    lengthComputable,
    total,
  };
  
  return ev;
}
