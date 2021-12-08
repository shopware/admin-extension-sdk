# Window

### Redirect to another URL

#### Usage:  
```ts
sw.window.redirect({
    url: 'https://www.shopware.com,
    newTab: true
})
```

#### Parameters:
| Name | Required | Default | Description |
| :------ | :------ | :------ | :------ |
| `url` | true | | The title of the notification |
| `newTab` | false | false | The message of the notification |

#### Return value:
Returns a promise without data.

### Reload page

Useful for development. You can trigger a page reload on file changes.

#### Usage:  
```ts
sw.window.reload()
```

#### Parameters:
No parameters required.

#### Return value:
Returns a promise without data.
