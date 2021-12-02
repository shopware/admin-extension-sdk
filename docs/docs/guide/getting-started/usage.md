---
sidebar_position: 2
---

# Usage

After [installing](./installation) the Admin Extension SDK you can use it directly in your Apps and Plugins.

## Adding functionality to new apps or plugins
You can use the SDK features directly in your JS file. Just import the specific feature (NPM way) or use the method in the
`sw` object (CDN way). You can find all features in the API Reference documentation.

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
Shopware 6 has a rich plugin extension system for the admin based on Twig and component overriding and extending. This
is very powerful but also has a steep learning curve. You can migrate gradually to the new Admin Extension SDK if you want.
Both approaches can work together so that you can start converting only some parts of your plugins in the beginning.
As more features come to the SDK the more parts you can convert. This will simplify your plugin in the long term usage.

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