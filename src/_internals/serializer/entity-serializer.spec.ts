import Entity from '../../data/_internals/Entity';
import cloneDeep from 'lodash/cloneDeep';
import SerializerFactory from './index';
import { handle, send } from '../../channel';

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
})

describe('entity-serializer.ts', () => {
  it('should convert entities', () => {
    const originValues = {
      string: 'jest-is-fun',
      number: 42,
      array: ['jest', 4, 'you'],
      object: {
        foo: 'bar',
      },
    };

    const association = new Entity('bar', 'jest-association', {...cloneDeep(originValues)});
    association.string = 'jest-is-more-fun';
    association.number = 1337;
    association.array.push('and me');
    association.object.foo = 'buz'

    const entity = new Entity('foo', 'jest', {
      ...cloneDeep(originValues),
      association,
    });
    entity.string = 'jest-is-more-fun';
    entity.number = 1337;
    entity.array.push('and me');
    entity.object.foo = 'buz';

    const messageData = {
      entity,
    };

    // Check if private properties are hidden behind the proxy
    const entityKeysBefore = Object.keys(messageData.entity);
    expect(entityKeysBefore).not.toContain('_origin');
    expect(entityKeysBefore).not.toContain('_isDirty');
    expect(entityKeysBefore).not.toContain('_isNew');

    const serializedMessageData = serialize(messageData);

    expect(serializedMessageData.entity.hasOwnProperty('__id__')).toBe(true);
    expect(serializedMessageData.entity.__id__).toBe('foo');

    expect(serializedMessageData.entity.hasOwnProperty('__entityName__')).toBe(true);
    expect(serializedMessageData.entity.__entityName__).toBe('jest');

    expect(serializedMessageData.entity.hasOwnProperty('__isDirty__')).toBe(true);
    expect(serializedMessageData.entity.__isDirty__).toBe(true);

    expect(serializedMessageData.entity.hasOwnProperty('__isNew__')).toBe(true);
    expect(serializedMessageData.entity.__isNew__).toBe(false);

    expect(serializedMessageData.entity.hasOwnProperty('__origin__')).toBe(true);
    expect(typeof serializedMessageData.entity.__origin__).toBe('object');

    expect(serializedMessageData.entity.__origin__.hasOwnProperty('string')).toBe(true);
    expect(serializedMessageData.entity.__origin__.string).toBe('jest-is-fun');

    expect(serializedMessageData.entity.__origin__.hasOwnProperty('number')).toBe(true);
    expect(serializedMessageData.entity.__origin__.number).toBe(42);

    expect(serializedMessageData.entity.__origin__.hasOwnProperty('array')).toBe(true);
    expect(serializedMessageData.entity.__origin__.array.length).toBe(3);

    expect(serializedMessageData.entity.__origin__.hasOwnProperty('object')).toBe(true);
    expect(typeof serializedMessageData.entity.__origin__.object).toBe('object');
    expect(serializedMessageData.entity.__origin__.object.hasOwnProperty('foo')).toBe(true);
    expect(serializedMessageData.entity.__origin__.object.foo).toBe('bar');

    expect(serializedMessageData.entity.hasOwnProperty('__draft__')).toBe(true);
    expect(typeof serializedMessageData.entity.__draft__).toBe('object');

    expect(serializedMessageData.entity.__draft__.hasOwnProperty('string')).toBe(true);
    expect(serializedMessageData.entity.__draft__.string).toBe('jest-is-more-fun');

    expect(serializedMessageData.entity.__draft__.hasOwnProperty('number')).toBe(true);
    expect(serializedMessageData.entity.__draft__.number).toBe(1337);

    expect(serializedMessageData.entity.__draft__.hasOwnProperty('array')).toBe(true);
    expect(serializedMessageData.entity.__draft__.array.length).toBe(4);

    expect(serializedMessageData.entity.__draft__.hasOwnProperty('object')).toBe(true);
    expect(typeof serializedMessageData.entity.__draft__.object).toBe('object');
    expect(serializedMessageData.entity.__draft__.object.hasOwnProperty('foo')).toBe(true);
    expect(serializedMessageData.entity.__draft__.object.foo).toBe('buz');

    expect(serializedMessageData.entity.__draft__.hasOwnProperty('association')).toBe(true);
    expect(typeof serializedMessageData.entity.__draft__.association).toBe('object');
    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__id__')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__id__).toBe('bar');

    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__entityName__')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__entityName__).toBe('jest-association');

    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__isDirty__')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__isDirty__).toBe(true);

    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__isNew__')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__isNew__).toBe(false);

    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__origin__')).toBe(true);
    expect(typeof serializedMessageData.entity.__draft__.association.__origin__).toBe('object');
    expect(serializedMessageData.entity.__draft__.association.__origin__.hasOwnProperty('string')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__origin__.hasOwnProperty('number')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__origin__.hasOwnProperty('array')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__origin__.hasOwnProperty('object')).toBe(true);

    expect(serializedMessageData.entity.__draft__.association.hasOwnProperty('__draft__')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__draft__.hasOwnProperty('string')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__draft__.hasOwnProperty('number')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__draft__.hasOwnProperty('array')).toBe(true);
    expect(serializedMessageData.entity.__draft__.association.__draft__.hasOwnProperty('object')).toBe(true);

    const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));

    // Assert that all entities are converted back to entities
    expect(typeof deserializedMessageData.entity).toBe('object');
    expect(typeof deserializedMessageData.entity.getDraft).toBe('function');
    expect(deserializedMessageData.entity.hasOwnProperty('association')).toBe(true);
    expect(typeof deserializedMessageData.entity.association).toBe('object');
    expect(typeof deserializedMessageData.entity.association.getDraft).toBe('function');

    // Assert entity values
    expect(deserializedMessageData.entity.getIsDirty()).toBe(true);
    expect(deserializedMessageData.entity.isNew()).toBe(false);
    expect(deserializedMessageData.entity.string).toBe('jest-is-more-fun');
    expect(deserializedMessageData.entity.number).toBe(1337);
    expect(deserializedMessageData.entity.array.length).toBe(4);
    expect(deserializedMessageData.entity.array[0]).toBe('jest');
    expect(deserializedMessageData.entity.array[1]).toBe(4);
    expect(deserializedMessageData.entity.array[2]).toBe('you');
    expect(deserializedMessageData.entity.array[3]).toBe('and me');
    expect(deserializedMessageData.entity.object.foo).toBe('buz');

    // Assert association values
    expect(deserializedMessageData.entity.association.isNew()).toBe(false);
    expect(deserializedMessageData.entity.association.getIsDirty()).toBe(true);
    expect(deserializedMessageData.entity.association.string).toBe('jest-is-more-fun');
    expect(deserializedMessageData.entity.association.number).toBe(1337);
    expect(deserializedMessageData.entity.association.array.length).toBe(4);
    expect(deserializedMessageData.entity.association.array[0]).toBe('jest');
    expect(deserializedMessageData.entity.association.array[1]).toBe(4);
    expect(deserializedMessageData.entity.association.array[2]).toBe('you');
    expect(deserializedMessageData.entity.association.array[3]).toBe('and me');
    expect(deserializedMessageData.entity.association.object.foo).toBe('buz');

    // Check if private properties are hidden behind the proxy
    const entityKeys = Object.keys(deserializedMessageData.entity);
    expect(entityKeys).not.toContain('_origin');
    expect(entityKeys).not.toContain('_isDirty');
    expect(entityKeys).not.toContain('_isNew');
  });
});
