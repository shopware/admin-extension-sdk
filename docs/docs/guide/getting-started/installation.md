---
title: "Installation"
sidebar_position: 1
---

# Installation

## Prerequisites:

You need to have an working [app](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide) or [plugin](https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide) installed on your Shopware 6 instance.

## Prepare your app or plugin

### App:

You need to create a HTML page with an JS file for your app. This page can be located anywhere. But it needs to be accessible from an URL.
For development purposes you can create a [local server](https://github.com/tapio/live-server) which will be [exposed publicly](https://ngrok.com/).

Then you need to add the `<base-app-url>` field to the `<admin>` section of the [manifest](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file) file. This field should contain the public URL of your app.

In your new HTML file you need inject a JS file. This file can use the Admin Extension SDK via CDN or if you want to use a build tools then you
can use the NPM package.

### Plugin:
**Notice:** Plugins are only working on self-hosted instances. You can't use the Shopware 6 cloud instance for plugins.

Open the path `custom/plugins/yourPlugin/src/Resources/app/administration`. This is the base path for all new admin files.

Create a new base `index.html` file. This file will be automatically injected to the administration when the plugin is activated. Then you need to create a JavaScript file in the subfolder `src/main.js`. This file will be automatically injected into the created HTML file on the fly.

For plugins the best way is to install the SDK via NPM. Before you can do this you need to initialize a new NPM project in your plugin folder with
`npm init --yes`.

## Installing the SDK:

The preferred way to use the library is using it as a NPM package. This guarantees the smallest bundle size for your apps and plugins because only necessary function are bundled.

The CDN method is easy to use and fast to implement. It is good for quick prototyping or if you don't want to work with building tools.

### Using NPM (require bundling):
Install it to your `package.json`
```
npm i --save @shopware-ag/admin-extension-sdk
```

and import it in your app or plugin:
```js
// import everything as one big object
import * as sw from '@shopware-ag/admin-extension-sdk';

// or import only needed functionality scope
import { notification }  from '@shopware-ag/admin-extension-sdk';

// or the direct method (here with an alias)
import { dispatch as dispatchNotification } from '@shopware-ag/admin-extension-sdk/es/notification'

```

### Using CDN:
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