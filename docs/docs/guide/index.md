---
id: "index"
title: "Introduction"
slug: "/guide/"
sidebar_label: "Introduction"
sidebar_position: 0.5
custom_edit_url: null
---

# Introduction

The Admin Extension SDK is a NPM library for Shopware 6 apps and plugins which want any easy way to extend or customize the administration.

It contains helper functions to communicate to the Admin, execute actions, subscribing data or extending the user interface.

- 🏗  **Works for Shopware 6 Apps and Plugins:** you can use the SDK for your plugins or apps. The API usage is identical.
- 🎢  **Low learning curve:** you don't need to have knowledge about the internal of the Shopware 6 admin. The SDK hides the complicated stuff behind beautiful API.
- 🧰  **Many extension capabilities:** from throwing notifications, accessing context information or extending the current UI. The feature set of the SDK will grow more and more. This gives you more possibilities and flexibility for your ideas and solutions.
- 🪨  **Stable API with great backward compatibility:** don't fear Shopware updates. Breaking changes in this SDK are the exception. If you use it then your Apps and Plugins will stay stable for a long time. Without code maintenance.
- 🧭  **Type safety:** the whole SDK is written in TypeScript. This provides you great autocompletion support and more safety for your Apps and Plugins.
- 💙  **Developer experience:** get a great development experience from the beginning. And it will be improved more and more in the future.
- 🪶  **Lightweight:** the whole library is completely tree-shakable, dependency-free and every functionality can be imported granularly so that your bundle stays small and fast.

Go to [Installation](./installation) to get started. Or check out the quick start:

## Quick start

Understand the Shopware Extension SDK by throwing a notification.

The requirements for this quick start are:
- [development Shopware 6 instance](https://developer.shopware.com/docs/guides/installation) or a [Shopware 6 cloud instance](https://www.shopware.com/en/products/shopware-cloud/)
- [clean Shopware 6 Plugin or App](https://developer.shopware.com/docs/guides/plugins/overview) which is activated

### App
1. Create a HTML file with following content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script src="https://unpkg.com/@shopware-ag/admin-extension-sdk/cdn"></script>

  <script>
    sw.notification.dispatch({
      title: 'My first notification',
      message: 'This was really easy to do'
    })
  </script>
</body>
</html>
```

2. Add the link to the webpage to the [manifest.xml](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file) of your App. For local files you can use [ngrok](https://ngrok.com/) to create a public URL for your HTML file.

3. Visit the Administration. After you logged in you should see the notification from your app.

Congratulation 🎉 You just create your first interaction with the Admin via the Admin Extension SDK.

### Plugin
**Notice:** Plugins are only working on self-hosted instances. You can't use the Shopware 6 cloud instance for plugins.

1. Create a new `index.html` file to your new plugin in the following path: `custom/plugins/yourPlugin/src/Resources/app/administration/index.html`. The HTML file should contain the following content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script src="https://unpkg.com/@shopware-ag/admin-extension-sdk/cdn"></script>

  <script>
    sw.notification.dispatch({
      title: 'My first notification',
      message: 'This was really easy to do'
    })
  </script>
</body>
</html>
```

2. Start the Shopware 6 Administration Watcher with the following command: 
```
./psh.phar administration:watch
```

After compiling all files a new browser window should be opened. There you should see the Administration. After logging in you should see the notification from your plugin.

Congratulation 🎉 You just create your first interaction with the Admin via the Admin Extension SDK.