# Datahandling

This guide elaborates how the data handling works between extensions and the Shopware administration.

## What are datasets?
Datasets consist of a unique identifier, an `id` and some `data` which could be anything from a single value to a whole entity.
The id gives some insight on what to expect as the value. For example `sw-product-detail__product` contains the product of the product detail page.

## How to find available datasets
You can explore all available datasets with the Vue Devtool extension we provide with the Shopware administration.

- Open the Vue DevTools in the Shopware Administration
- Change to the Shopware Extension API inspector

In this inspector you will see all published datasets if there are any in the current view.


#### Example
![Action button example](./assets/devtool-example.png)
