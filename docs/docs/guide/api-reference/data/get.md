# Get

With `data.get` you can receive datasets from the Shopware administration.
More information on how to find the unique identifiers can be found in [this guide](../../internals/datahandling.md).

#### Usage:  
```ts
data.get(
    {
        id: 'sw-product-detail__product',
    },
).then((data) => {
    console.log(data);
});
```

#### Parameters
| Name                 | Required | Description                                                                                           |
| :------------------- | :------- | :---------------------------------------------------------------------------------------------------- |
| `options`            | true     | Options containing the unique `id`                                                                    |
