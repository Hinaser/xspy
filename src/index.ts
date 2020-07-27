import {Spy} from "./Spy";
import {XMLHttpRequestWithSpy} from "./XMLHttpRequestWithSpy";
import {WindowEx} from "./index.type";

declare let window: WindowEx;

Spy.setXMLHttpRequestWithSpy(XMLHttpRequestWithSpy);
Spy.enable();

window.fetchXhrHook = Spy;
