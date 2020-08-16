# xspy
[![npm version](https://badge.fury.io/js/xspy.svg)](https://badge.fury.io/js/xspy) [![Coverage Status](https://coveralls.io/repos/github/Hinaser/xspy/badge.svg?branch=v0.0.1)](https://coveralls.io/github/Hinaser/xspy?branch=v0.0.1) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hook ajax request and/or response. Modify header, body, status, credentials, etc in request/response

- Catch fetch/XMLHttpRequest request before it is sent.
- Catch fetch/XMLHttpRequest response before it is available to client.
- Comes with type definitions by Typescript for great developer experience.
- High test coverage
- Works in modern browsers and **IE9/10/11**.

## Doc
<https://hinaser.github.io/xspy/>

## Browser Support
Tested with IE9+, Firefox, Chrome, Edge.

You can test this module in your favorite browser by `git clone` this repo and `npm run test` or `yarn test` in it.

## Install
### Browser
Copy `/dist/xspy.es5.min.js` and load into your \<script\> tag before any fetch/XMLHttpRequest.

```html
<!-- Rename `xspy.es5.min.js` as you like -->
<script src="xspy.es5.min.js"></script>
```

### Webpack project

```
npm install xspy -- OR yarn add xspy
```
#### CommonJS
```js
const xspy = require("xspy").default;
```
#### Typescript
```typescript
import xspy from "xspy";
```

## Example

### Add Authorization header if it doesn't exist on request header

```js
xspy.onRequest((req) => {
  if(!req.headers["Authorization"]){
    req.headers["Authorization"] = "bearer sakxxd0ejdalkjdalkjfajd";
  }
});
```

### Return fake API response without sending actual ajax request
```js
xspy.onRequest((req, callback) => {
  const fakeResponse = {
    status: 200,
    statusText: "OK",
    body: "This is fake response!",
  };
  callback(fakeResponse);
});
```

### Log every response headers to console
```js
xspy.onResponse((req, res) => {
  console.log(res.url, res.status, res.headers);
});
```

## API

### `xspy.onRequest(listener, [n])`
- `listener`: (request, \[callback]) => void
  - `request`: Request
  - `callback`: (\[response]) => void
    - `response`: Response
- `n`: number

Add custom request `listener` to index `n`. (listener at index `n`=0 will be called first)  
If you do not specify `n`, it appends `listener` to the last. (Called after all previous listeners finishes.)

This `listener` will be called just before web request by `window.fetch()` or `xhr.sent()` departs from browser.  
You can modify the request object(i.e. headers, body) before it is sent. See detail for request object later.

Note that when you supplies `listener` as 2 parameters function(`request` and `callback`),
request will not be dispatched until you manually run `callback()` function in `listener`.

If you run `callback()` without any arguments or with non-object value like `false`, 
request processing goes forward without generating fake response.

If you run `callback(res)` with a fake response object, it immediately returns the fake response after all onRequest listeners
finishes. In this case, real request never flies to any external network.

### `xspy.onResponse(listener, [n])`
- `listener`: (request, response, \[callback]) => void
  - `request`: Request
  - `response`: Response
  - `callback`: () => void
- `n`: number

Add custom response `listener` to index `n`. (listener at index `n`=0 will be called first)  
If you do not specify `n`, it appends `listener` to the last. (Called after all previous listeners finishes.)

This `listener` will be called just before API response is available at
`window.fetch().then(res => ...)` or `xhr.onreadystatechange`, and so on.  
You can modify the response object before it is available to the original requester. See detail for response object later.

Note that when you supplies `listener` as 3 parameters function(`request`, `response` and `callback`),
response will not be returned to the original requester until you manually run `callback()` function in `listener`.

### `xspy.enable()`

**When xspy module is loaded from \<script\> tag or import/require, it is enabled by default.*

Enable spying on request/response by `window.fetch()` and/or `xhr.send()`.
When enabled, `window.fetch` and `XMLHttpRequest` is replaced by extended function/object to intercept communications.

### `xspy.disable()`

Disable spying on request/response. `window.fetch` and `XMLHttpRequest` will be set back to original ones.  
Note that request/response listeners are not cleared and stored in memory.

### `Request`

Properties of `Request` object can be edited in request listener.
Some properties are only available for specific `ajaxType`.

- `ajaxType`: string - "xhr" or "fetch". Indicating whether request is dispatched from `fetch()` or `xhr.send()`.
- `method`: string - Request method like `GET`/`POST`/`PUT`/`DELETE`/...
- `url`: string - Request url.
- `timeout`: number - Ignored if `ajaxType` is `fetch`
- `headers`: Object - i.e. `{"Authorization": "auth-strings", "content-type": "application/json"}`
- `body`: Various types - Request body. It can be undefined if original requester does not set request body.

**And if `ajaxType` is `xhr`**
- `async` `username` `password` `responseType` `withCredentials` `upload`

**And else if `ajaxType` is `fetch`**
- `cache` `credentials` `integrity` `keepalive` `mode` `redirect` `referrer` `referrerPolicy` `signal`

### `Response`

Properties of `Response` object can be edited in response listener.
Some properties are only available for specific `ajaxType`.

- `ajaxType`: string - "xhr" or "fetch". Indicating whether response is for `fetch().then(res => ...)` or `xhr`.
- `status`: number
- `statusText`: string
- `headers`: Object
- `body?`: Various types - Response body

**And if `ajaxType` is `xhr`**
- `responseType` `response` `responseText` `responseXML` `responseURL`
 
**And else if `ajaxType` is `fetch`**
- `ok` `redirected` `type` `url`
 
## Work inspired by

<https://github.com/jpillora/xhook>
