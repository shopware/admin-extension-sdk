/* eslint-disable @typescript-eslint/no-explicit-any */
import type { send, handle } from '../../channel';
import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';
import HandleErrorSerializer from './handle-error-serializer';
import cloneDeepWith from 'lodash/cloneDeepWith';
import MissingPrivilegesErrorSerializer from './missing-priviliges-error-serializer';

interface SerializerDependencies {
  send: typeof send,
  handle: typeof handle,
}

interface customizerProperties {
  value: any,
  key: number | string | undefined,
  object: any | undefined,
  stack: any,
  event?: MessageEvent<string>,
  customizerMethod: (messageData: any, event?: MessageEvent<string>) => any,
}
interface serializer {
  name: string,
  serialize: (customizerProperties: customizerProperties) => any,
  deserialize: (customizerProperties: customizerProperties) => any,
}

export type SerializerFactory = (dependencies: SerializerDependencies) => serializer;

/**
 * Collect all single serializer/deserializer. The first matching result
 * will be used as the customizer in cloneDeepWith
 */
const serializerFactories: SerializerFactory[] = [
  CriteriaSerializer,
  EntityCollectionSerializer,
  EntitySerializer,
  FunctionSerializer,
  HandleErrorSerializer,
  MissingPrivilegesErrorSerializer,
];

/**
 * The main serializer factory. It returns a general serializer/deserializer which combines
 * all single serializer
 */
export default function mainSerializerFactory(dependencies: SerializerDependencies): {
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
      // return first matching serializer result
      for (const serializer of serializers) {
        const result = serializer.serialize({
          value,
          key,
          object,
          stack,
          customizerMethod: serialize,
        });

        if (result) {
          return result;
        };
      }
    });
  }


  function deserialize(messageData: any, event?: MessageEvent<string>): any {
    return cloneDeepWith<unknown>(messageData, (value, key, object, stack) => {
      // return first matching serializer result
      for (const serializer of serializers) {
        const result = serializer.deserialize({
          value,
          key,
          object,
          stack,
          event,
          customizerMethod: deserialize,
        });

        if (result) {
          return result;
        };
      }
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

