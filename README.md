# xspy

- Hook fetch/XMLHttpRequest request to modify before it is sent.
- Hook fetch/XMLHttpRequest response before it is available to client.
- Comes with type definitions by Typescript for good developer experience.

## Doc
https://hinaser.github.io/xspy/

## Browser Support
Confirmed working in IE9+, Firefox, Chrome, Edge

## Install
### Browser
Copy `/dist/xspy.es5.min.js` and load into your <script> tag before any fetch/XMLHttpRequest.

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

#### Add Authorization header if it doesn't exist on request header.

```js
xspy.onRequest((req) => {
  if(!req.headers["Authorization"]){
    req.headers["Authorization"] = "bearer sakxxd0ejdalkjdalkjfajd";
  }
});
```

#### Return fake API response without sending actual ajax request.
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

#### Log every response headers to console.
```js
xspy.onResponse((req, res) => {
  console.log(res.url, res.status, res.headers);
});
```

## Work inspired by

https://github.com/jpillora/xhook
