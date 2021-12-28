---
id: "index"
title: "Introduction"
slug: "/guide/"
sidebar_label: "Introduction"
sidebar_position: 0.5
custom_edit_url: null
---

# Introduction

The Admin Extension SDK is an NPM library for Shopware 6 apps and plugins that need an easy way of extending or customizing the Administration.

It contains helper functions to communicate with the Administration, execute actions, subscribe to data or extend the user interface.

- 🏗  **Works with Shopware 6 Apps and Plugins:** you can use the SDK for your plugins or apps. API usage is identical.
- 🎢  **Shallow learning curve:** you don't need to have extensive knowledge about the internals of the Shopware 6 Administration. Our SDK hides the complicated stuff behind a beautiful API.
- 🧰  **Many extension capabilities:** from throwing notifications, accessing context information or extending the current UI. The feature set of the SDK will gradually be extended, providing more possibilities and flexibility for your ideas and solutions.
- 🪨  **A stable API with great backwards compatibility:** don't fear Shopware updates anymore. Breaking changes in this SDK are an exception. If you use the SDK, your apps and plugins will stay stable for a longer time, without any need for code maintenance.
- 🧭  **Type safety:** the whole SDK is written in TypeScript which provides great autocompletion support and more safety for your apps and plugins.
- 💙  **Developer experience:** have a great development experience right from the start. And it will become better and better in the future.
- 🪶  **Lightweight:** the whole library is completely tree-shakable and dependency-free. Every functionality can be imported granularly to keep your bundle as small and fast as possible.

Go to [Installation](./1_getting-started/installation) to get started. Or check out the quick start guide:

## Quick start

Understand the Shopware Extension SDK by learning how to throw a notification.

Requirements for this quick start guide are:
- [development Shopware 6 instance](https://developer.shopware.com/docs/guides/installation) or a [Shopware 6 cloud instance](https://www.shopware.com/en/products/shopware-cloud/)
- [clean Shopware 6 Plugin or App](https://developer.shopware.com/docs/guides/plugins/overview) which is activated

### App
1. Create an HTML file with following content:
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

2. Add the link to the webpage and to the [manifest.xml](https://developer.shopware.com/docs/guides/plugins/apps/app-base-guide#manifest-file) of your app. For local files you can use [ngrok](https://ngrok.com/) to create a public URL for your HTML file.

3. Visit the Administration. After you have logged in you should see the notification from your app.

Congratulation 🎉 You just created your first interaction with the Administration via the Admin Extension SDK.

### Plugin
**Notice:** Plugins will only be working on self-hosted instances. You can't use a Shopware 6 cloud instance for plugins.

1. Create a new `index.html` file to your new plugin in the following path: `custom/plugins/yourPlugin/src/Resources/app/administration/index.html`. The HTML file should have the following content:
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

2. Start the Shopware 6 Administration watcher using the following command: 
```
./psh.phar administration:watch
```

After all files have been compiled, a new browser window should open, in which you should see the Administration. After logging in, you should see the notification from your plugin.

Congratulations 🎉 You just created your first interaction with the Administration via the Admin Extension SDK.