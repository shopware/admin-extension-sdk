import { isObject, hasType } from '../utils';
import type { Entity } from '../../data/_internals/Entity';
import EntityClass from '../../data/_internals/Entity';
import type { SerializerFactory } from '.';
import type { serializeFunction, deserializeFunction } from './index';

const EntitySerializerFactory: SerializerFactory = () => {
  /* eslint-disable */
  const serialize: serializeFunction = ({ value, customizerMethod }): any => {
    if (!isObject(value) || typeof value.getDraft !== 'function') {
      return;
    }

    const entity = value as Entity;

    return {
      __type__: '__Entity__',
      __id__: entity.id,
      __entityName__: entity._entityName,
      __isDirty__: entity._isDirty,
      __isNew__: entity._isNew,
      __origin__: customizerMethod(entity._origin),
      __draft__: customizerMethod(entity._draft),
    };
  }

  const deserialize: deserializeFunction = ({ value, customizerMethod }): any => {
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
  }
  
  return {
    name: 'entity',
    serialize,
    deserialize,
  };
}

export default EntitySerializerFactory;