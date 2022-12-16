# Register CMS element

> Available since Shopware v6.4.17.0

With `cms.registerCmsElement` you can register CMS elements to use in the Shopping Experiences Module.
More information on how to develop CMS elements can be found in [this guide](https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element).

![Register a CMS element in your Shopping Experiences Module via App](../assets/register-cms-element-example.png)

#### Usage:
```ts
void cms.registerCmsElement({
    name: 'dailymotionElement',
    label: 'Dailymotion Video',
    defaultConfig: {
        dailyUrl: {
            source: 'static',
            value: '',
        },
    },
});
```

#### Parameters
| Name            | Required | Description                                                                                              |
|:----------------|:---------|:---------------------------------------------------------------------------------------------------------|
| `name`          | true     | The name of the cms element, which will also be used to generate locationIds - Should have vendor prefix |
| `label`         | true     | The label, which is visible when selecting the cms element - Use snippet keys here!                      |
| `defaultConfig` | true     | Object containing the defaultConfig; same like in plugin development.                                    |
