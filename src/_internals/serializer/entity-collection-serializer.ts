import {hasType, traverseObject} from '../utils';
import EntityCollection from '../../data/_internals/EntityCollection';
import type { SerializerFactory } from '.';

const EntityCollectionSerializerFactory: SerializerFactory = () => {  
  /* eslint-disable */
  function serialize<MESSAGE_TYPE extends object>(messageData: MESSAGE_TYPE): void {
    traverseObject(messageData, ((parentEntry, key , value) => {
      if (value instanceof EntityCollection) {
        parentEntry[key] = {
          __type__: '__EntityCollection__',
          __source__: value.source,
          __entityName__: value.entity,
          __context__: value.context,
          __criteria__: value.criteria,
          __entities__: Array.from(value),
          __total__: value.total,
          __aggregations__: value.aggregations,
        };
      }
    }));
  }
  
  function deserialize<MESSAGE_TYPE extends object>(messageData: MESSAGE_TYPE): void {
    traverseObject(messageData, ((parentEntry, key, value) => {
      if (hasType('__EntityCollection__', value)) {
        parentEntry[key] = new EntityCollection(
          value.__source__,
          value.__entityName__,
          value.__context__,
          value.__criteria__,
          value.__entities__,
          value.__total__,
          value.__aggregations__
        );
      }
    }));
  }
  
  return {
    name: 'entity-collection',
    serialize,
    deserialize,
  };
}
export default EntityCollectionSerializerFactory;