# Main module

### Add main module
Add a main module to your extension. The content of the main module is determined by your `locationId`. 
A specific view or a set of actions can be triggered based on the `locationId`.

#### Usage:  
```ts
ui.mainModule.addMainModule({
    heading: 'My App',
    locationId: 'main-location-id',
});
```

#### Parameters
| Name                    | Required | Default | Description                            |
|:------------------------|:---------|:--------|:---------------------------------------|
| `heading`               | true     |         | The heading displayed in your module   |
| `locationId`            | true     |         | The Id for the content of the module   |
| `displaySearchBar`      | false    | true    | Toggles the sw-page search bar on/off  |
| `displayLanguageSwitch` | false    | false   | Toggles sw-page language switch on/off |

#### Example
![Main module example](./assets/add-main-module-example.png)
```ts
import { location, ui } from '@shopware-ag/admin-extension-sdk';

// General commands
if (location.is(location.MAIN_HIDDEN)) {
    // Add the main module
    ui.mainModule.addMainModule({
        heading: 'My App',
        locationId: 'main-location-id',
    });

  // If you want to provide some buttons for the smart bar of your main module
  ui.mainModule.addSmartbarButton({
      locationId: 'main-location-id', // locationId of your main module
      buttonId: 'test-button', // The button id
      label: 'Click me', // The button label
      variant: 'primary', // The button variant
      onClickCallback: () => {}
  });
}

// Render your custom view
if (location.is('main-location-id')) {
    document.body.innerHTML = '<h1 style="text-align: center">Hello from your main module</h1>';
}
```
