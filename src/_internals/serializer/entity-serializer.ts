import { isObject, hasType } from '../utils';
import EntityClass from '../../data/_internals/Entity';
import type { SerializerFactory } from '.';

/* eslint-disable */
const EntitySerializerFactory: SerializerFactory = () => ({
  name: 'entity',

  serialize: ({ value, customizerMethod }): any => {
    if (!isObject(value) || typeof value.__identifier__ !== 'function' || value.__identifier__() !== 'Entity') {
      return;
    }

    return {
      __type__: '__Entity__',
      __id__: value.id,
      __entityName__: value._entityName,
      __isDirty__: value._isDirty,
      __isNew__: value._isNew,
      __origin__: customizerMethod(value._origin),
      __draft__: customizerMethod(value._draft),
    };
  },

  deserialize: ({ value, customizerMethod }): any => {
    if (hasType('__Entity__', value) && typeof value.__origin__ === 'object') {
      return new EntityClass(
        value.__id__,
        value.__entityName__,
        customizerMethod(value.__draft__),
        {
          originData: customizerMethod(value.__origin__),
          isDirty: value.__isDirty__,
          isNew: value.__isNew__,
        }
      );
    }
  },
});

export default EntitySerializerFactory;