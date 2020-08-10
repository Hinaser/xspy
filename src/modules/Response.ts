export class ResponseProxy {
  private _response: Response;
  private _body?: BodyInit | null;
  private _init?: ResponseInit;
  
  public headers: Headers;
  public ok: boolean;
  public redirected: boolean;
  public status: number;
  public statusText: string;
  public trailer: Promise<Headers>;
  public type: ResponseType;
  public url: string;
  
  public body: ReadableStream<Uint8Array> | null;
  public bodyUsed: boolean;
  
  public constructor(body?: BodyInit | null, init?: ResponseInit) {
    this._response = new Response(body, init);
    this._body = body;
    this._init = init;
  
    this.headers = new Headers(init ? init.headers : undefined);
    this.ok = false;
    this.redirected = false;
    this.status = init && init.status ? init.status : 0;
    this.statusText = init && init.statusText ? init.statusText : "";
    this.trailer = this._response.trailer;
    this.type = "basic";
    this.url = "";
    
    this.body = this._response.body;
    this.bodyUsed = this._response.bodyUsed;
  }
  
  public static error(){
    return Response.error();
  }
  
  public static redirect(url: string, status?: number){
    return Response.redirect(url, status);
  }
  
  public clone(){
    return new ResponseProxy(this._body, this._init);
  }
  
  public arrayBuffer(){
    return this._response.arrayBuffer();
  }
  
  public blob(){
    return this._response.blob();
  }
  
  public formData(){
    return this._response.formData();
  }
  
  public json(){
    return this._response.json();
  }
  
  public text(){
    return this._response.text();
  }
}
