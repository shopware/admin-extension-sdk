# Location

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