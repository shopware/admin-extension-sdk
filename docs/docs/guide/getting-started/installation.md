---
title: "Installation"
---

# Installation

The preferred way to use the library is using it as a NPM package. This guarantees the smallest bundle size for your apps and plugins because only necessary function are bundled.

The CDN method is easy to use and fast to implement. It is good for quick prototyping or if you don't want to work with building tools.

## Using NPM:
Install it to your `package.json`
```
npm i --save @shopware-ag/admin-extension-sdk
```

and import it in your app:
```js
// import everything
import * as sw from '@shopware-ag/admin-extension-sdk';

// or import only needed functionality
import { notification }  from '@shopware-ag/admin-extension-sdk';
```

## Using CDN:
Import the source from the CDN

```js
// use the latest version available
<script src="https://unpkg.com/@shopware-ag/admin-extension-sdk/cdn"></script>

// use a fix version (example here: 1.2.3)
<script src="https://unpkg.com/@shopware-ag/admin-extension-sdk@1.2.3/cdn"></script>
```

and then you can access it with the global variable `sw`.

```js
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```