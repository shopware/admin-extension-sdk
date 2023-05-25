import EntityCollection, {ApiContext} from '../../data/_internals/EntityCollection';
import Criteria from '../../data/Criteria';
import Entity from '../../data/_internals/Entity';
import SerializerFactory from './index';
import { handle, send } from '../../channel';
import Vue from 'vue';

const { serialize, deserialize } = SerializerFactory({
  handle: handle,
  send: send,
})

describe('entity-collection-serializer.ts', () => {
  [
    {
      testName: 'should convert collections',
      createMessageData: () => {
        const collection = new EntityCollection(
          'test',
          // @ts-expect-error - we know that this entity does not exist
          'jest',
          {} as ApiContext,
          new Criteria(),
          [],
          42,
          ['test', 'foo']
        );
    
        // @ts-expect-error - we know that this entity does not exist
        collection.add(new Entity('1', 'test', {}));
        // @ts-expect-error - we know that this entity does not exist
        collection.add(new Entity('2', 'test', {}));
    
        const messageData = {
          collection,
        };

        return messageData;
      }
    },
    {
      testName: 'should convert collections even when they are converted with Vue.observable',
      createMessageData: () => {
        const collection = new EntityCollection(
          'test',
          // @ts-expect-error - we know that this entity does not exist
          'jest',
          {} as ApiContext,
          new Criteria(),
          [],
          42,
          ['test', 'foo']
        );
    
        // @ts-expect-error - we know that this entity does not exist
        collection.add(new Entity('1', 'test', {}));
        // @ts-expect-error - we know that this entity does not exist
        collection.add(new Entity('2', 'test', {}));

        const observableCollection = Vue.observable(collection);
    
        const messageData = {
          collection: observableCollection,
        };

        return messageData;
      }
    }
  ].forEach(({ testName, createMessageData }) => {
    it(testName, () => {
      const messageData = createMessageData();
      const serializedMessageData = serialize(messageData);

      expect(typeof serializedMessageData.collection).toBe('object');
      expect(typeof serializedMessageData.collection.getIds).toBe('undefined');
      
      expect(serializedMessageData.collection.hasOwnProperty('__type__')).toBe(true);
      expect(serializedMessageData.collection.__type__).toBe('__EntityCollection__');
      expect(serializedMessageData.collection.hasOwnProperty('__source__')).toBe(true);
      expect(serializedMessageData.collection.__source__).toBe('test');
      
      expect(serializedMessageData.collection.hasOwnProperty('__entityName__')).toBe(true);
      expect(serializedMessageData.collection.__entityName__).toBe('jest');
      
      expect(serializedMessageData.collection.hasOwnProperty('__context__')).toBe(true);
      expect(typeof serializedMessageData.collection.__context__).toBe('object');
      
      expect(serializedMessageData.collection.hasOwnProperty('__criteria__')).toBe(true);
      expect(serializedMessageData.collection.__criteria__ instanceof Criteria).toBe(false);
      
      expect(serializedMessageData.collection.hasOwnProperty('__entities__')).toBe(true);
      expect(Array.isArray(serializedMessageData.collection.__entities__)).toBe(true);
      expect(serializedMessageData.collection.__entities__.length).toBe(2);
      expect(serializedMessageData.collection.__entities__[0].__id__).toBe('1');
      expect(serializedMessageData.collection.__entities__[1].__id__).toBe('2');
      
      expect(serializedMessageData.collection.hasOwnProperty('__total__')).toBe(true);
      expect(serializedMessageData.collection.__total__).toBe(42);
      
      expect(serializedMessageData.collection.hasOwnProperty('__aggregations__')).toBe(true);
      expect(serializedMessageData.collection.__aggregations__).toStrictEqual(['test', 'foo']);

      const deserializedMessageData = deserialize(serializedMessageData, new MessageEvent(''));

      expect(deserializedMessageData.collection instanceof EntityCollection).toBe(true);
      expect(deserializedMessageData.collection.total).toBe(42);
      expect(deserializedMessageData.collection.criteria instanceof Criteria).toBe(true);
      expect(deserializedMessageData.collection.aggregations).toStrictEqual(['test', 'foo']);
      expect(deserializedMessageData.collection.source).toBe('test');
      expect(deserializedMessageData.collection.entity).toBe('jest');

      expect(typeof deserializedMessageData.collection.first()?.getDraft).toBe('function');
      expect(typeof deserializedMessageData.collection.last()?.getDraft).toBe('function');
    });
  });
});
