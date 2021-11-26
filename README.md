# Warning:
### This repository is still under development and should not be used yet.
 
--------

# Admin Extension SDK
[![Tests](https://github.com/shopware/admin-extension-sdk/actions/workflows/tests.yml/badge.svg)](https://github.com/shopware/admin-extension-sdk/actions/workflows/tests.yml)
[![NPM Package](https://img.shields.io/npm/v/@shopware-ag/admin-extension-sdk)](https://www.npmjs.com/package/@shopware-ag/admin-extension-sdk)

The `admin-extension-sdk` is a JavaScript library for all [Shopware 6](https://github.com/shopware/platform) App and Plugin developer which want an easy way to extend and customize the administration.

[See Documentation](https://shopware.github.io/admin-extension-sdk/)

## Installation
#### Using NPM:
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

#### Using CDN:
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

## Features
- **Works for Shopware 6 Apps and Plugins:** you can use the SDK for your plugins or apps. The API usage is identical.
- **Low learning curve:** you don't need to have knowledge about the internal of the Shopware 6 admin. The SDK hides the complicated stuff behind beautiful API.
- **Many extension capabilities:** from throwing notifications, accessing context information or extending the current UI. The feature set of the SDK will grow more and more. This gives you more possibilities and flexibility for your ideas and solutions.
- **Stable API with great backward compatibility:** don't fear Shopware updates. Breaking changes in this SDK are the exception. If you use it then your Apps and Plugins will stay stable for a long time. Without code maintenance.
- **Type safety:** the whole SDK is written in TypeScript. This provides you great autocompletion support and more safety for your Apps and Plugins.
- **Developer experience:** get a great development experience from the beginning. And it will be improved more and more in the future.
- **Lightweight:** the whole library is completely tree-shakable, dependency-free and every functionality can be imported granularly so that your bundle stays small and fast.

## Examples

Throw a notification:
```js
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```

Get the system currency:
```js
const currency = await sw.context.getCurrency();
```

Subscribe for UI locale changes:
```js
let currentLocale = 'en-GB';

sw.context.subscribeLocale(({ locale }) => {
  currentLocale = locale;
})
```

See more examples in the [Documentation](https://shopware.github.io/admin-extension-sdk/).