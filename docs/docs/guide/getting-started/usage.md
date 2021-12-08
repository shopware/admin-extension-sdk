---
sidebar_position: 2
---

# Usage

After [installing](./installation) the Admin Extension SDK successfully you can use it in your apps and plugins.

## Adding functionality to new apps or plugins
You can use the SDK features directly in your JS file. Just import the specific feature (NPM method) or use the method in the
`sw` object (CDN method). You can find all features in the API reference documentation.

### NPM example:
```js
// import notification toolkit from the SDK
import { notification }  from '@shopware-ag/admin-extension-sdk';

// dispatch a new notification
notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```

### CDN example:
```js
// access the "notification" toolkit in the global "sw" object and dispatch a new notification
sw.notification.dispatch({
  title: 'My first notification',
  message: 'This was really easy to do'
})
```


## Adding functionality to existing plugins
Shopware 6 has a rich plugin extension system for the Admin based on Twig and the concepts of component overriding and component extending. These
concepts are very powerful, but may also come with a steep learning curve. That's why you can migrate gradually to the new Admin Extension SDK, if you want.
Both approaches can work together. This way you can start by converting only parts of your plugins at first and then gradually converting more and more of your plugins as new features are added to the SDK.
This approach is also going to help with simplifying your plugins and preparing them for long term usage.

### Example:

```js
// Use existing extension capabilties
Shopware.Component.override('sw-dashboard-index', {
    methods: {
        async createdComponent() {
          // Can also use Admin Extension SDK features
          await sw.notification.dispatch({
            title: 'Hello from the plugin',
            message: 'I am combining the existing approach with the new SDK approach',
          })

          this.$super('createdComponent');
        }
    }
});
```