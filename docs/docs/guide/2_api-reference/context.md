# Context

## Language

### Get current language

#### Usage:  
```ts
const language = await sw.context.getLanguage();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  languageId: string,
  systemLanguageId: string
}>
```

#### Example value:
```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

### Subscribe on language changes

#### Usage:  
```ts
sw.context.subscribeLanguage(({ languageId, systemLanguageId }) => {
  // do something with the callback data
});
```

#### Parameters
| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the language changes |

#### Callback value:
```ts
{
  languageId: string,
  systemLanguageId: string
}
```

#### Example callback value:
```ts
{
  languageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b',
  systemLanguageId: '2fbb5fe2e29a4d70aa5854ce7ce3e20b'
}
```

## Environment

### Get current environment

#### Usage:  
```ts
const environment = await sw.context.getEnvironment();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<'development' | 'production' | 'testing'>
```

#### Example value:
```ts
'development'
```

## Locale

### Get current locale

#### Usage:  
```ts
const locale = await sw.context.getLocale();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  locale: string,
  fallbackLocale: string
}>
```

#### Example value:
```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

### Subscribe on locale changes

#### Usage:  
```ts
sw.context.subscribeLocale(({ locale, fallbackLocale }) => {
  // do something with the callback data
});
```

#### Parameters
| Name | Description |
| :------ | :------ |
| `callbackMethod` | Called every-time the locale changes |

#### Callback value:
```ts
{
  locale: string,
  fallbackLocale: string
}
```

#### Example callback value:
```ts
{
  locale: 'de-DE',
  fallbackLocale: 'en-GB'
}
```

## Currency

### Get current currency

#### Usage:  
```ts
const currency = await sw.context.getCurrency();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  systemCurrencyId: string,
  systemCurrencyISOCode: string
}>
```

#### Example value:
```ts
{
  systemCurrencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
  systemCurrencyISOCode: 'EUR'
}
```

## Shopware version

### Get current Shopware version

#### Usage:  
```ts
const shopwareVersion = await sw.context.getShopwareVersion();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
string
```

#### Example value:
```ts
'6.4.0.0'
```

## App information

### Get app information

#### Usage:  
```ts
const { name, version, type } = await sw.context.getAppInformation();
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{ name: string ; version: string ; type: 'app' | 'plugin' }>
```

#### Example value:
```ts
{
  name: 'my-extension',
  version: '1.2.3',
  type: 'app'
}
```

## Module informatio

### Get module information
Get information about all registered modules. These modules are created by adding new menu items, setting items, etc.

The ID can be used to change the current route to the module.

#### Usage:  
```ts
const { modules } = await sw.context.getModuleInformation();

sw.window.routerPush({
  name: 'sw.extension.sdk.index',
  params: {
    id: modules[0].id // get the ID of the wanted module
  }
})
```

#### Parameters
No parameters needed.

#### Return value:
```ts
Promise<{
  modules: Array<{
    displaySearchBar: boolean,
    heading: string,
    id: string,
    locationId: string
  }>
}}>
```

#### Example value:
```ts
{
  modules: [
    {
      displaySearchBar: true,
      heading: 'My module',
      id: 'sd5aasfsdfas',
      locationId: 'my-location-id'
    }
  ]
}
```
