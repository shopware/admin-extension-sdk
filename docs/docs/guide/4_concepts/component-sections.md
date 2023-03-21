# Component sections

In most cases extension developers will directly use the extension capabilities of the UI components (e.g. adding tab items, adding button to grid, ...). This will cover most needs of many extensions. But in cases where a extension need special solutions which aren't feasible with the given extension they can use a feature named `Component Sections`. These are sections where any extension developer can inject components.

These components are prebuilt (like cards) and contain in most cases custom [location](./locations.md) where the extension has the full freedom to render anything.

### Example:

```js
if (location.is(location.MAIN_HIDDEN)) {
  // Choose a position id where you want to render a custom component
  sw.ui.componentSection('sw-manufacturer-card-custom-fields__before').add({
      // The Component Sections provides different components out of the box
      component: 'card', 
      // Props are depending on the type of component
      props: {
          title: 'Hello from plugin',
          subtitle: 'I am before the properties card',
          // Some components can render a custom view. In this case the extension can render custom content in the card.
          locationId: 'my-app-card-before-properties',
          // Add/remove padding of the card content
          contentPadding: true,
      }
  })
}

// Render the custom UI when the iFrame location matches your defined location
if (sw.location.is('my-app-card-before-properties')) {
    document.body.innerHTML = '<h1>Hello World before</h1>';
    document.body.style.background = 'blue';
}
```

![Component Sections screenshot example](./assets/component-sections-example.png)
