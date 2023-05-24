import { hasType } from '../utils';
import EntityCollection from '../../data/_internals/EntityCollection';
import type { SerializerFactory } from '.';

/* eslint-disable */
const EntityCollectionSerializerFactory: SerializerFactory = () => ({
  name: 'entity-collection',

  serialize: ({ value, customizerMethod }): any => {
    if (value instanceof EntityCollection || (value?.__identifier__ && value.__identifier__() === 'EntityCollection')) {
      return customizerMethod({
        __type__: '__EntityCollection__',
        __source__: value.source,
        __entityName__: value.entity,
        __context__: value.context,
        __criteria__: value.criteria,
        __entities__: Array.from(value),
        __total__: value.total,
        __aggregations__: value.aggregations,
      });
    }
  },

  deserialize: ({ value, customizerMethod }): any => {
    if (hasType('__EntityCollection__', value)) {
      return new EntityCollection(
        value.__source__,
        value.__entityName__,
        value.__context__,
        customizerMethod(value.__criteria__),
        customizerMethod(value.__entities__),
        value.__total__,
        value.__aggregations__
      );
    }
  },
})

export default EntityCollectionSerializerFactory;