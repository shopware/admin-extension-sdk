---
title: "Installation"
sidebar_position: 1
nav:
  position: 10
---

# Installation

## Prerequisites:

You need to have an working [app](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide) or [plugin](https://developer.shopware.com/docs/guides/plugins/plugins/plugin-base-guide) installed on your Shopware 6 instance.

## Prepare your app or plugin

### App:

You need to create a HTML page with an JS file for your app. This page can be located anywhere, but it needs to be accessible from an URL.
For development purposes you can create a [local server](https://github.com/tapio/live-server) which will be [exposed publicly](https://ngrok.com/).

Then you need to add the `<base-app-url>` field to the `<admin>` section of the [manifest](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file) file. This field should contain the public URL of your app. Let's assume your app HTML page is served under `http://localhost/my-example-app.html`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/Framework/App/Manifest/Schema/manifest-1.0.xsd">
    <meta>
        <name>MyExampleApp</name>
        <!-- App meta data... -->
    </meta>
    <admin>
        <!-- Insert your app page URL here -->
        <base-app-url>http://localhost/my-example-app.html</base-app-url>
    </admin>
</manifest>
```

In your new HTML file you need inject a JS file. This file can use the Admin Extension SDK via CDN or if you want to use a build tools then you
can use the NPM package.

### Plugin:
**Notice:** Plugins will work on self-hosted instances only. You won't be able to use a Shopware 6 cloud instance with plugins.

Open the path `custom/plugins/yourPlugin/src/Resources/app/administration`. This is the base path for all new admin files.

Create a new base `index.html` file. This file will be automatically injected to the administration when the plugin is activated. Then you need to create a JavaScript file in the subfolder `src/main.js`. This file will be automatically injected into the created HTML file.

For plugins the best way is to install the SDK via NPM. But first you need to initialize a new NPM project in your plugin folder with
`npm init --yes`.

## Installing the SDK:

The preferred way of using the library is with a NPM package. This guarantees the smallest bundle size for your apps and plugins, since this way only necessary functions are bundled together.

The CDN method is easy to use and fast to implement. It is best used for quick prototyping or if you don't want to work with building tools.

### Using NPM (require bundling):
Install it to your `package.json`
```
npm i --save @shopware-ag/admin-extension-sdk
```

and import it into your app or plugin:
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

and access it with the global variable `sw`.

```js
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```
