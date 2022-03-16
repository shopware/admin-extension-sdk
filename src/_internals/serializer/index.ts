/* eslint-disable @typescript-eslint/no-explicit-any */
import type { send, handleFactory } from '../../channel';
import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';
import cloneDeepWith from 'lodash/cloneDeepWith';

export type customizerProperties = {
  value: any,
  key: number | string | undefined,
  object: any | undefined,
  stack: any,
  event?: MessageEvent<string>,
  customizerMethod: (messageData: any, event?: MessageEvent<string>) => any,
}

export type serializeFunction = (customizerProperties: customizerProperties) => any;
export type deserializeFunction = (customizerProperties: customizerProperties) => any;

interface SerializerDependencies {
  send: typeof send,
  handleFactory: typeof handleFactory,
}

export type SerializerFactory = (dependencies: SerializerDependencies) => serializer;
interface serializer {
  name: string,
  serialize: serializeFunction,
  deserialize: deserializeFunction,
}

const serializerFactories: SerializerFactory[] = [
  CriteriaSerializer,
  EntityCollectionSerializer,
  EntitySerializer,
  FunctionSerializer,
];

export default function serializerFactory(dependencies: SerializerDependencies): {
  getSerializers: () => serializer[],
  getSerializerByName: (name: string) => serializer | null,
  serialize: (messageData: any) => any,
  deserialize: (messageData: any, event: MessageEvent<string>) => any,
} {
  const serializers = serializerFactories.map(serializerFactory => serializerFactory(dependencies));

  function getSerializers(): serializer[] {
    return serializers;
  }
  
  function getSerializerByName(name: string): serializer | null {
    return serializers.find(serializer => serializer.name === name) ?? null;
  }
  
  /* eslint-disable */
  function serialize(messageData: any): any {
    return cloneDeepWith<unknown>(messageData, (value, key, object, stack) => {
      // find first matching result
      const serializerResults: any[] = serializers.map(serializer => {
        return serializer.serialize({
          value,
          key,
          object,
          stack,
          customizerMethod: serialize,
        });
      });

      // get first serializer result which is not undefined
      return serializerResults.find(r => !!r);
    });
  }

  
  function deserialize(messageData: any, event?: MessageEvent<string>): any {
    return cloneDeepWith<unknown>(messageData, (value, key, object, stack) => {
      // find first matching result
      const deserializerResults: any[] = serializers.map(serializer => {
        return serializer.deserialize({
          value,
          key,
          object,
          stack,
          event,
          customizerMethod: deserialize,
        });
      });

      // get first serializer result which is not undefined
      return deserializerResults.find(r => !!r);
    });
  }

  /* eslint-enable */

  return {
    getSerializers,
    getSerializerByName,
    serialize,
    deserialize,
  };
}

