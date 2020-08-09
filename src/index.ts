import {Proxy} from "./Proxy";
import {WindowEx} from "./index.type";
import {XHRProxy} from "./XMLHttpRequest";
import {fetchProxy} from "./fetch";

declare let window: WindowEx;

Proxy.setXMLHttpRequest(XHRProxy);
Proxy.setFetch(fetchProxy);
Proxy.enable();

export default Proxy;
