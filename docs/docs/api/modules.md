---
id: "modules"
title: "@shopware-ag/admin-app-actions"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Namespaces

- [sendTypes](namespaces/sendTypes)

## Functions

### on

▸ **on**<`SEND_TYPE`\>(`type`, `method`): () => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SEND_TYPE` | extends keyof `ShopwareSendTypes` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `SEND_TYPE` | Choose a type of action from the {@link send-types} |
| `method` | (`data`: `SendDataType`<`SEND_TYPE`\>) => `ShopwareSendTypes`[`SEND_TYPE`][``"responseType"``] | This method should return the response value |

#### Returns

`fn`

The return value is a cancel function to stop listening to the events

▸ (): `void`

##### Returns

`void`

The return value is a cancel function to stop listening to the events

#### Defined in

[index.ts:105](https://github.com/shopware/admin-app-actions/blob/bc5c7bb/lib/index.ts#L105)

___

### send

▸ **send**<`SEND_TYPE`\>(`type`, `data`): `Promise`<`ShopwareSendTypes`[`SEND_TYPE`][``"responseType"``]\>

With this method you can send actions:

```javascript
 send('redirect', {
   url: 'https://www.shopware.com',
   newTab: true,
 })
```

or you can request data:
```javascript
send('getPageTitle', {}).then((pageTitle) => {
  console.log(pageTitle)
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SEND_TYPE` | extends keyof `ShopwareSendTypes` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `SEND_TYPE` | Choose a type of action from the {@link send-types} |
| `data` | `SendDataType`<`SEND_TYPE`\> | The matching data for the type |

#### Returns

`Promise`<`ShopwareSendTypes`[`SEND_TYPE`][``"responseType"``]\>

A promise with the response data in the given responseType

#### Defined in

[index.ts:62](https://github.com/shopware/admin-app-actions/blob/bc5c7bb/lib/index.ts#L62)
