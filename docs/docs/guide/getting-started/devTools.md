---
title: "Vue dev tools"
sidebar_position: 2
---

# Vue dev tools
 
## Prerequisites
We assume that you got the [Vue dev tools](https://devtools.vuejs.org/) installed for your browser.
The extension is available for Chrome, Firefox, Edge and as a standalone app.

## Development setup
Furthermore you should have [Shopware](https://github.com/shopware/platform) setup.
To make use of the Extension API plugin for the Vue dev tools start the watcher of the administration:

```bash
$ composer run watch:admin
```

## Vue dev tool plugin
Once you logged into your administration, open up the development tools of your browser and choose the Vue tab.
Inside the Vue tab choose the Shopware Extension API plugin.

![Devtools plugin](./assets/devtools-plugin.png)

## Usage
The plugin will show you all extension points for the current page you visit.
Once you select an extension point it will highlight the corresponding area in the viewport and give detailed information how to extend the highlighted property.

![Devtools usage](./assets/devtools-usage.png)