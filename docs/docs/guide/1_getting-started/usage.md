---
sidebar_position: 3
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

#### Example:

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

### Using locations with normal Vue components without iFrame rendering
It is useful when you want to migrate partially from the twig plugin system to the SDK extension system that you use both systems together. To make this happen you can render normal Vue components in the Shopware administration for the locations instead of your iFrame view.

To do this you need to register the component in the existing plugin system:

```js
Shopware.Component.register('your-component-name', {
  // your component
})
```

Now if you want to render the component in a location you need to add the name of the component to the current location. This can be done with the `sdkLocation` store:
```js
Shopware.State.commit('sdkLocation/addLocation', {
    locationId: 'your-location-id',
    componentName: 'your-component-name'
})
```

With this feature you can create mix the usage of the SDK and the existing plugin system. A complete example could be looking like this. It creates a new tab item in the product detail page, renders a card with the componentSection renderer and inside the card it renders the location. But instead of the traditional location it renders a Vue component which was registered in the Shopware Component Factory.

```js
// in a normal plugin js file without a HTML file
import { ui, location } from '@shopware-ag/admin-extension-sdk';

if (!location.isIframe()) {
  const myLocationId = 'my-example-location-id';

  // Create a new tab entry
  ui.tabs('sw-product-detail').addTabItem({
      label: 'Example tab',
      componentSectionId: 'example-product-detail-tab-content'
  })

  // Add a new card to the tab content which renders a location
  ui.componentSection.add({
      component: 'card',
      positionId: 'example-product-detail-tab-content',
      props: {
          title: 'Component section example',
          locationId: myLocationId
      }
  })

  // Register your component which should be rendered inside the location
  Shopware.Component.register('your-component-name', {
    // your component
  })

  // Add the component name to the specific location
  Shopware.State.commit('sdkLocation/addLocation', {
      locationId: myLocationId,
      componentName: 'your-component-name'
  })
}
```