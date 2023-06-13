# Subscribe

With `data.subscribe` you can subscribe to dataset changes. The callback will be called every time, the dataset with the matching id is changed. 
More information on how to find the unique identifiers can be found in [this guide](../../5_internals/datahandling.md).

#### Usage:  
```ts
data.subscribe(
    'sw-product-detail__product',
    ({id, data}) => {
        console.log(data);
    },
    selectors: ['name', 'manufacturer.name'],
);
```

#### Parameters
| Name        | Required | Description                                                                                           |
| :---------- | :------- | :---------------------------------------------------------------------------------------------------- |
| `id`        | true     | The unique id of the dataset you want to receive                                                      |
| `callback`  | true     | A callback function which will be called every time the Shopware Administration publishes the dataset |
| `selectors` | false    | Selectors for reducing the payload and minimizing the needed privileges                               |
