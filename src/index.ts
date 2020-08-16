import {XSpy as xspy} from "./XSpy";
import {XHRProxy} from "./modules/XMLHttpRequest";
import {fetchProxy} from "./modules/fetch";

xspy.setXMLHttpRequest(XHRProxy);
xspy.setFetch(fetchProxy);
xspy.enable();

export default xspy;
