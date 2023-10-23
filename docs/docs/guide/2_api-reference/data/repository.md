# Repository

The data handling of the SDK allows you to fetch and write nearly everything in the database. The behavior matches the data handling in the main administration. The only difference is the implementation details because the data handling don't request the server directly. It communicates with the admin which handles the requests, changesets, saving and more.

The data handling implements the repository pattern. You can create a repository for an entity simply like this:

```ts
sw.data.repository('your_entity_name')
```

With this repository you can search for data, save it, delete it, create it or check for changes.


### Permissions
For every action on the repository, your app will need the matching permissions.
Permissions are set in the app manifest file and are grouped by action.
For actions you can choose between `create`, `read`, `update` and `delete`.
Remember everytime you adjust the permissions in your manifest you need to increase the app version and update it.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<manifest
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="https://raw.githubusercontent.com/shopware/platform/trunk/src/Core/Framework/App/Manifest/Schema/manifest-1.0.xsd">

    <!-- ... -->

    <permissions>
        <create>product</create>
        <read>product</read>
        <update>product</update>
        <delete>product</delete>
    </permissions>
</manifest>

```

### Criteria

For requesting data you need to create a Criteria class which contains all information for the request:

```ts
const criteria = new sw.data.Classes.Criteria();

criteria.setPage(1);
criteria.setLimit(10);
criteria.setTerm('foo');
criteria.setIds(['some-id', 'some-id']); // Allows to provide a list of ids which are used as a filter

/**
    * Configures the total value of a search result.
    * 0 - no total count will be selected. Should be used if no pagination required (fastest)
    * 1 - exact total count will be selected. Should be used if an exact pagination is required (slow)
    * 2 - fetches limit * 5 + 1. Should be used if pagination can work with "next page exists" (fast)
*/
criteria.setTotalCountMode(2);

criteria.addFilter(
    Criteria.equals('product.active', true)
);

criteria.addSorting(
    Criteria.sort('product.name', 'DESC')
);

criteria.addAggregation(
    Criteria.avg('average_price', 'product.price')
);

criteria.getAssociation('categories')
    .addSorting(Criteria.sort('category.name', 'ASC'));
```


### Search
Sends a search request for the repository entity.

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

const yourEntities = await exampleRepository.search(yourCriteria);
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `criteria` | true     |         | Your criteria object                           |
| `context`  | false    | {}      | Change the [request context](#request-context) |

#### Return value:
The return value is a EntityCollection which contains all entities matching the criteria.

### Get
Short hand to fetch a single entity from the server

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

const yourEntity = await exampleRepository.get('theEntityId');
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `id`       | true     |         | The id of the entity                           |
| `context`  | false    | {}      | Change the [request context](#request-context) |
| `criteria` | true     |         | Your criteria object                           |

#### Return value:
The return value is the entity result when a matching entity was found.

### Save
Detects all entity changes and send the changes to the server.
If the entity is marked as new, the repository will send a POST create. Updates will be send as PATCH request.
Deleted associations will be send as additional request

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

await exampleRepository.save(yourEntityObject);
```

#### Parameters:
| Name      | Required | Default | Description                                    |
| :-------- | :------- | :------ | :--------------------------------------------- |
| `entity`  | true     |         | The entity object                              |
| `context` | false    | {}      | Change the [request context](#request-context) |

#### Return value:
This method does not have a return value. It just returns a Promise which is resolved when it was saved successfully.

### Clone
Clones an existing entity

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

const clonedEntityId = await exampleRepository.clone('theEntityIdToClone');
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `entityId` | true     |         | The entity id which should be cloned           |
| `context`  | false    | {}      | Change the [request context](#request-context) |

#### Return value:
This method returns the id of the cloned entity.

### Has changes
Detects if the entity or the relations has remaining changes which are not synchronized with the server

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

const hasChanges = await exampleRepository.hasChanges(yourEntityObject);
```

#### Parameters:
| Name     | Required | Default | Description       |
| :------- | :------- | :------ | :---------------- |
| `entity` | true     |         | The entity object |

#### Return value:
This method returns a boolean value. If the entity has changes then it returns `true`. Otherwise it returns `false`.

### Save all
Detects changes of all provided entities and send the changes to the server

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

await exampleRepository.saveAll(yourEntityCollection);
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `entities` | true     |         | Your entity collection which should be saved   |
| `context`  | false    | {}      | Change the [request context](#request-context) |

#### Return value:
This method does not have a return value. It just returns a Promise which is resolved when it was saved successfully.

### Delete
Sends a delete request for the provided id.

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

await exampleRepository.delete('yourEntityId');
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `entityId` | true     |         | The id of the entity which should be deleted   |
| `context`  | false    | {}      | Change the [request context](#request-context) |

#### Return value:
This method does not have a return value. It just returns a Promise which is resolved when it was deleted successfully.

### Create
Creates a new entity for the local schema. To Many association are initialed with a collection with the corresponding remote api route. This entity is not saved to the database yet.

#### Usage:  
```ts
const exampleRepository = sw.data.repository('your_entity');

const yourNewEntity = await exampleRepository.create();
```

#### Parameters:
| Name       | Required | Default | Description                                    |
| :--------- | :------- | :------ | :--------------------------------------------- |
| `context`  | false    | {}      | Change the [request context](#request-context) |
| `id` | false     |         | You can provide a id of the new entity if wanted   |

#### Return value:
This method returns the newly created entity.

### Request Context
You can optionally change the context of the request. It will be merged together with the base API context.

```ts
const exampleContext = {
    // Load also inherited data (example from parent product in variant)
    inheritance: true,
    // Change the language context of the entity to change data in different languages
    languageId: 'theLanguageId',
    // If you are working with versioned entities you can change the current live version id
    liveVersionId: 'yourLiveVersionId'
}
```
