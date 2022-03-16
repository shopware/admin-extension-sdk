import {traverseObject, isObject, hasType} from '../utils';
import type { Entity } from '../../data/_internals/Entity';
import EntityClass from '../../data/_internals/Entity';
import type { SerializerFactory } from '.';

const EntitySerializerFactory: SerializerFactory = () => {
  /* eslint-disable */
  function serialize<MESSAGE_TYPE extends object>(messageData: MESSAGE_TYPE): void {
    traverseObject(messageData, ((parentEntry, key, value) => {
      if (!isObject(value) || typeof value.getDraft !== 'function') {
        return;
      }
  
      const entity = value as Entity;
  
      parentEntry[key] = {
        __type__: '__Entity__',
        __id__: entity.id,
        __entityName__: entity._entityName,
        __isDirty__: entity._isDirty,
        __isNew__: entity._isNew,
        __origin__: entity._origin,
        __draft__: entity._draft,
      };
    }));
  }
  
  function deserialize<MESSAGE_TYPE extends object>(
    messageData: MESSAGE_TYPE
  ): void {
    traverseObject(messageData, ((parentEntry, key, value) => {
      if (hasType('__Entity__', value) && typeof value.__origin__ === 'object') {
        const entity = new EntityClass(
          value.__id__,
          value.__entityName__,
          value.__draft__,
          {
            originData: value.__origin__,
            isDirty: value.__isDirty__,
            isNew: value.__isNew__,
          }
        );
  
        parentEntry[key] = entity;
      }
    }));
  }
  
  return {
    name: 'entity',
    serialize,
    deserialize,
  };
}

export default EntitySerializerFactory;