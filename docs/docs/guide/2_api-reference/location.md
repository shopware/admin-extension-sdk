# Location

## Prerequisites
We recommend you read the [concept](../4_concepts/locations.md) of locations first.
## Location checks

### Check the current location id

Check if the current location matches the given location Id.

#### Usage:

```ts
if (sw.location.is('my-location-id')) {
    // Render view for location
}
```

#### Parameters:
| Name         | Required | Default | Description              |
| :----------- | :------- | :------ | :----------------------- |
| `locationId` | true     |         | The location Id to check |

#### Return value:
Returns a boolean. It is `true` if the location Id matches the current location.

### Get the current location id

Get the name of the current location ID

#### Usage:

```ts
const currentLocation = sw.location.get()
```

#### Return value:
Returns a string with the name of the current location.

### Check if current location is inside iFrame

Useful for hybrid extensions which are using plugin and Extension SDK functionalities together. You can use this 
check to separate code which should be executed inside the Extension SDK context and the plugin context.

#### Usage:

```ts
if (location.isIframe()) {
    // Execute the code which uses the Admin-Extension-SDK context
    import('./extension-code');
} else {
    // Execute the plugin code
    import('./plugin-code');
}
```

## iFrame Heights

#### Parameters:
No parameters needed.

#### Return value:
Returns a boolean. If it is executed inside a iFrame it returns `true`.

### Update the height of the location iFrame

You can update the height of the iFrame with this method.

#### Usage:

```ts
sw.location.updateHeight(750);
```

#### Parameters:
| Name            | Required | Default        | Description                                                                                                    |
| :-------------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------- |
| `iFrame height` | false    | Auto generated | The height of the iFrame. If no value is provided it will be automatically calculated from the current height. |

#### Return value:
This method does not have a return value.

### Start auto resizing of the iFrame height

This methods starts the auto resizer of the iFrame height.

![Auto resizing example](../4_concepts/assets/auto-resizer.gif)

#### Usage:

```ts
sw.location.startAutoResizer();
```

#### Parameters:
No parameters needed.

#### Return value:
This method does not have a return value.

### Stop auto resizing of the iFrame height

This methods stops the auto resizer of the iFrame height.

#### Usage:

```ts
sw.location.stopAutoResizer();
```

#### Parameters:
No parameters needed.

#### Return value:
This method does not have a return value.

## URL changes inside your app

Important: You can track and emit your URL changes only inside your own main module or settings page.

### Update URL

Send the current URL of your iFrame to the administration. When the user reloads the whole page your iFrame will get the
last page you sent to the administration.

#### Usage:

```ts
const currentUrl = window.location.href;

sw.location.updateUrl(new URL(currentUrl))
```

#### Parameters:
| Name            | Required | Default | Description                           |
| :-------------- | :------- | :------ | :------------------------------------ |
| First parameter | true     |         | An URL object which contains your URL |

### Start automatic URL updates

To avoid manually sending URL changes you can use this helper methods. It sends automatically changes in your URL to the
administration.

#### Usage:

```ts
sw.location.startAutoUrlUpdater();
```

### Stop automatic URL updates

If you had started an automatic URL updater before then you can stop it by calling this method.

#### Usage:

```ts
sw.location.stopAutoUrlUpdater();
```