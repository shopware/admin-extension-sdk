import {deserialize, serialize} from './index';
import EntityCollection, {ApiContext} from '../../data/_internals/EntityCollection';
import Criteria from '../../data/Criteria';
import Entity from '../../data/_internals/Entity';

describe('entity-collection-serializer.ts', () => {
  it('should convert collections', () => {
    const collection = new EntityCollection(
      'test',
      'jest',
      {} as ApiContext,
      new Criteria(),
      [],
      42,
      ['test', 'foo']
    );

    collection.add(new Entity('1', 'test', {}));
    collection.add(new Entity('2', 'test', {}));

    const messageData = {
      collection,
    };

    serialize(messageData);

    expect(typeof messageData.collection).toBe('object');
    expect(typeof messageData.collection.getIds).toBe('undefined');
    expect(messageData.collection.hasOwnProperty('__type__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__type__).toBe('__EntityCollection__');
    expect(messageData.collection.hasOwnProperty('__source__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__source__).toBe('test');
    expect(messageData.collection.hasOwnProperty('__entityName__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__entityName__).toBe('jest');
    expect(messageData.collection.hasOwnProperty('__context__')).toBe(true);
    // @ts-ignore
    expect(typeof messageData.collection.__context__).toBe('object');
    expect(messageData.collection.hasOwnProperty('__criteria__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__criteria__ instanceof Criteria).toBe(false);
    expect(messageData.collection.hasOwnProperty('__entities__')).toBe(true);
    // @ts-ignore
    expect(Array.isArray(messageData.collection.__entities__)).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__entities__.length).toBe(2);
    // @ts-ignore
    expect(messageData.collection.__entities__[0].__id__).toBe('1');
    // @ts-ignore
    expect(messageData.collection.__entities__[1].__id__).toBe('2');
    expect(messageData.collection.hasOwnProperty('__total__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__total__).toBe(42);
    expect(messageData.collection.hasOwnProperty('__aggregations__')).toBe(true);
    // @ts-ignore
    expect(messageData.collection.__aggregations__).toStrictEqual(['test', 'foo']);

    deserialize(messageData, new MessageEvent(''));

    expect(messageData.collection instanceof EntityCollection).toBe(true);
    expect(messageData.collection.total).toBe(42);
    expect(messageData.collection.criteria instanceof Criteria).toBe(true);
    expect(messageData.collection.aggregations).toStrictEqual(['test', 'foo']);
    expect(messageData.collection.source).toBe('test');
    expect(messageData.collection.entity).toBe('jest');
    expect(typeof messageData.collection.first()?.getDraft).toBe('function');
    expect(typeof messageData.collection.last()?.getDraft).toBe('function');
  });
});
