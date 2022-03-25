# Get

With `data.get` you can receive datasets from the Shopware administration.
More information on how to find the unique identifiers can be found in [this guide](../../5_internals/datahandling.md).

#### Usage:  
```ts
data.get(
    'sw-product-detail__product',
    ({id, data}) => {
        console.log(data);
    },
);
```

#### Parameters
| Name                 | Required | Description                                                                                           |
| :------------------- | :------- | :---------------------------------------------------------------------------------------------------- |
| `id`                 | true     | The unique id of the dataset you want to receive                                                      |
| `callback`           | true     | A callback function which will be called every time the Shopware Administration publishes the dataset |

## Callback
Your callback will get called as soon as the dataset is published and every time it changes.