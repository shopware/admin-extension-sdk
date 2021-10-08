---
id: "sendTypes"
title: "Namespace: sendTypes"
sidebar_label: "sendTypes"
sidebar_position: 0
custom_edit_url: null
---

## Type aliases

### createAlert

Ƭ **createAlert**: `Object`

Create a alert notification.

```js
send('createAlert', {
  message: 'My alert message'
})
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | This message will be shown in the alert |
| `responseType` | `void` | - |

#### Defined in

[send-types.ts:10](https://github.com/jleifeld/postmessage-api-concept/blob/641fe56/lib/send-types.ts#L10)

___

### getPageTitle

Ƭ **getPageTitle**: `Object`

Get the actual page title
```js
send('redirect', {}).then(pageTitle => {
  console.log(pageTitle)
})
```

#### Type declaration

| Name | Type |
| :------ | :------ |
| `responseType` | `string` |

#### Defined in

[send-types.ts:48](https://github.com/jleifeld/postmessage-api-concept/blob/641fe56/lib/send-types.ts#L48)

___

### redirect

Ƭ **redirect**: `Object`

Redirect to another URL

```js
send('redirect', {
  url: 'https://www.shopware.com',
  newTab: true
})
```

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `newTab` | `boolean` | If this is activated then the link will be opened in a new tab |
| `responseType` | `void` | - |
| `url` | `string` | The URL for the redirection |

#### Defined in

[send-types.ts:28](https://github.com/jleifeld/postmessage-api-concept/blob/641fe56/lib/send-types.ts#L28)
