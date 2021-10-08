# Warning:
### This repository is still under development and should not be used yet.
 
--------

[![E2E Tests](https://github.com/shopware/admin-app-actions/actions/workflows/cypress.yml/badge.svg)](https://github.com/shopware/admin-app-actions/actions/workflows/cypress.yml) [![Lint](https://github.com/shopware/admin-app-actions/actions/workflows/lint.yml/badge.svg)](https://github.com/shopware/admin-app-actions/actions/workflows/lint.yml) [![NPM_SIZE](https://img.shields.io/bundlephobia/minzip/@shopware-ag/admin-app-actions?logo=npm)](https://bundlephobia.com/package/@shopware-ag/admin-app-actions)

# Admin app actions
### for the Shopware 6 app system

This small library is for using admin actions in your app iframes.

Your app can then extend the Administration with many different actions, customizing UI elements and more. It can send actions to the administration or receive data from it.

```js
send('redirect', {
  url: 'https://www.shopware.com',
  newTab: true
})
```

## Installation

#### Using NPM:
Install it to your `package.json`
```
npm i --save @shopware/admin-app-actions
```

Then import it in your app:
```js
import { send } from '@shopware/admin-app-actions;
```

#### Using CDN:
Import the source from the CDN:

```js
// use the latest version available
<script src="https://unpkg.com/@shopware-ag/admin-app-actions/admin-app-actions.umd.js"></script>

// use a fix version (example here: 1.2.3)
<script src="https://unpkg.com/@shopware-ag/admin-app-actions@1.2.3/admin-app-actions.umd.js"></script>
```

Then you can access it with the global variable `AdminAppActions`.

```js
const { send } = AdminAppActions;
```

## Features

- Simple API
- Sending actions to the admin
- Receive data from the admin
- Extremely small footprint on app side
- Full Typescript support

### Simple API
The API is very expressive and easy to learn. You just need to import our library and then you can use the send method for sending actions and receiving data.

The iframe are using only the function `send` for sending the actions. The first parameter is the action-type and the second parameter contains the options for the action.

```js
import { send } from 'sw-app-actions';

send('redirect', {
  url: 'https://www.shopware.com',
  newTab: true,
})
```

If the action has a response then you can get the information with the returned Promise value:

```javascript
import { send } from 'sw-app-actions';

const pageTitle = await send('getPageTitle', {});
```

## Extremely small footprint on app side
The bundle size of this library is extremely small and will not grow when new actions will be defined. How is this done? The functions only execute the commands. Only types are describing the API and therefore not increase the bundle size. 

## Full Typescript support
Typescript provides a good developer experience for everyone using this tool. Every action and options can be autocompleted by the IDE. If you are also writing your application in Typescript you get direct feedback if you are doing a mistake in using the API.

A full auto-generated API documentation can be found in the documentation: [TODO: Add link here]

___________

## Recipient (only for usage in the Shopware 6 Administration):
The Shopware 6 administration listens to all messages. If a message matches an action then the given functionality will be called. Here is an example code how it can look like:

```ts
import { on } from 'sw-app-actions'

on('redirect', ({ newTab, url }) => {  
  // call a method which redirects to the url
  redirect({ newTab, url });
})

on('getPageTitle', () => {  
  // or return the value if the type needs a response
  return document.title;
})

```