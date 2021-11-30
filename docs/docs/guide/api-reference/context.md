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
  systemCurrencyId: 'EUR',
  systemCurrencyISOCode: 'b7d2554b0ce847cd82f3ac9bd1c0dfca'
}
```