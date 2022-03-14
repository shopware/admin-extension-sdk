import {deserialize, serialize } from './index';
import Entity from '../../data/_internals/Entity';
import cloneDeep from 'lodash/cloneDeep';

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

    serialize(messageData);

    expect(messageData.entity.hasOwnProperty('__id__')).toBe(true);
    expect(messageData.entity.__id__).toBe('foo');

    expect(messageData.entity.hasOwnProperty('__entityName__')).toBe(true);
    expect(messageData.entity.__entityName__).toBe('jest');

    expect(messageData.entity.hasOwnProperty('__isDirty__')).toBe(true);
    expect(messageData.entity.__isDirty__).toBe(true);

    expect(messageData.entity.hasOwnProperty('__isNew__')).toBe(true);
    expect(messageData.entity.__isNew__).toBe(false);

    expect(messageData.entity.hasOwnProperty('__origin__')).toBe(true);
    expect(typeof messageData.entity.__origin__).toBe('object');

    expect(messageData.entity.__origin__.hasOwnProperty('string')).toBe(true);
    expect(messageData.entity.__origin__.string).toBe('jest-is-fun');

    expect(messageData.entity.__origin__.hasOwnProperty('number')).toBe(true);
    expect(messageData.entity.__origin__.number).toBe(42);

    expect(messageData.entity.__origin__.hasOwnProperty('array')).toBe(true);
    expect(messageData.entity.__origin__.array.length).toBe(3);

    expect(messageData.entity.__origin__.hasOwnProperty('object')).toBe(true);
    expect(typeof messageData.entity.__origin__.object).toBe('object');
    expect(messageData.entity.__origin__.object.hasOwnProperty('foo')).toBe(true);
    expect(messageData.entity.__origin__.object.foo).toBe('bar');

    expect(messageData.entity.hasOwnProperty('__draft__')).toBe(true);
    expect(typeof messageData.entity.__draft__).toBe('object');

    expect(messageData.entity.__draft__.hasOwnProperty('string')).toBe(true);
    expect(messageData.entity.__draft__.string).toBe('jest-is-more-fun');

    expect(messageData.entity.__draft__.hasOwnProperty('number')).toBe(true);
    expect(messageData.entity.__draft__.number).toBe(1337);

    expect(messageData.entity.__draft__.hasOwnProperty('array')).toBe(true);
    expect(messageData.entity.__draft__.array.length).toBe(4);

    expect(messageData.entity.__draft__.hasOwnProperty('object')).toBe(true);
    expect(typeof messageData.entity.__draft__.object).toBe('object');
    expect(messageData.entity.__draft__.object.hasOwnProperty('foo')).toBe(true);
    expect(messageData.entity.__draft__.object.foo).toBe('buz');

    expect(messageData.entity.__draft__.hasOwnProperty('association')).toBe(true);
    expect(typeof messageData.entity.__draft__.association).toBe('object');
    expect(messageData.entity.__draft__.association.hasOwnProperty('__id__')).toBe(true);
    expect(messageData.entity.__draft__.association.__id__).toBe('bar');

    expect(messageData.entity.__draft__.association.hasOwnProperty('__entityName__')).toBe(true);
    expect(messageData.entity.__draft__.association.__entityName__).toBe('jest-association');

    expect(messageData.entity.__draft__.association.hasOwnProperty('__isDirty__')).toBe(true);
    expect(messageData.entity.__draft__.association.__isDirty__).toBe(true);

    expect(messageData.entity.__draft__.association.hasOwnProperty('__isNew__')).toBe(true);
    expect(messageData.entity.__draft__.association.__isNew__).toBe(false);

    expect(messageData.entity.__draft__.association.hasOwnProperty('__origin__')).toBe(true);
    expect(typeof messageData.entity.__draft__.association.__origin__).toBe('object');
    expect(messageData.entity.__draft__.association.__origin__.hasOwnProperty('string')).toBe(true);
    expect(messageData.entity.__draft__.association.__origin__.hasOwnProperty('number')).toBe(true);
    expect(messageData.entity.__draft__.association.__origin__.hasOwnProperty('array')).toBe(true);
    expect(messageData.entity.__draft__.association.__origin__.hasOwnProperty('object')).toBe(true);

    expect(messageData.entity.__draft__.association.hasOwnProperty('__draft__')).toBe(true);
    expect(messageData.entity.__draft__.association.__draft__.hasOwnProperty('string')).toBe(true);
    expect(messageData.entity.__draft__.association.__draft__.hasOwnProperty('number')).toBe(true);
    expect(messageData.entity.__draft__.association.__draft__.hasOwnProperty('array')).toBe(true);
    expect(messageData.entity.__draft__.association.__draft__.hasOwnProperty('object')).toBe(true);

    deserialize(messageData, new MessageEvent(''));

    // Assert that all entities are converted back to entities
    expect(typeof messageData.entity).toBe('object');
    expect(typeof messageData.entity.getDraft).toBe('function');
    expect(messageData.entity.hasOwnProperty('association')).toBe(true);
    expect(typeof messageData.entity.association).toBe('object');
    expect(typeof messageData.entity.association.getDraft).toBe('function');

    // Assert entity values
    expect(messageData.entity.isNew()).toBe(false);
    expect(messageData.entity.getIsDirty()).toBe(true);
    expect(messageData.entity.string).toBe('jest-is-more-fun');
    expect(messageData.entity.number).toBe(1337);
    expect(messageData.entity.array.length).toBe(4);
    expect(messageData.entity.array[0]).toBe('jest');
    expect(messageData.entity.array[1]).toBe(4);
    expect(messageData.entity.array[2]).toBe('you');
    expect(messageData.entity.array[3]).toBe('and me');
    expect(messageData.entity.object.foo).toBe('buz');

    // Assert association values
    expect(messageData.entity.association.isNew()).toBe(false);
    expect(messageData.entity.association.getIsDirty()).toBe(true);
    expect(messageData.entity.association.string).toBe('jest-is-more-fun');
    expect(messageData.entity.association.number).toBe(1337);
    expect(messageData.entity.association.array.length).toBe(4);
    expect(messageData.entity.association.array[0]).toBe('jest');
    expect(messageData.entity.association.array[1]).toBe(4);
    expect(messageData.entity.association.array[2]).toBe('you');
    expect(messageData.entity.association.array[3]).toBe('and me');
    expect(messageData.entity.association.object.foo).toBe('buz');
  });
});
