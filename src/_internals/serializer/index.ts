import type { send, handleFactory } from '../../channel';
import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';

export type serializeFunction = <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA) => void;
export type deserializeFunction = (<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA) => void) |
  (<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA, event: MessageEvent<string>) => void);

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
  FunctionSerializer,
  CriteriaSerializer,
  EntityCollectionSerializer,
  EntitySerializer,
];

export default function serializerFactory(dependencies: SerializerDependencies): {
  getSerializers: () => serializer[],
  getSerializerByName: (name: string) => serializer | null,
  serialize: <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA) => void,
  deserialize: <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA, event: MessageEvent<string>) => void,
} {
  const serializers = serializerFactories.map(serializerFactory => serializerFactory(dependencies));

  function getSerializers(): serializer[] {
    return serializers;
  }
  
  function getSerializerByName(name: string): serializer | null {
    return serializers.find(serializer => serializer.name === name) ?? null;
  }
  
  function serialize <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
    /*
     * Serializer need to run twice to also cover hidden properties
     * which gets created in the first iteration
     */
    for (let i = 0; i < 2; i++) {
      serializers.forEach(serializer => serializer.serialize(messageData));
    }
  }
  
  function deserialize <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA, event: MessageEvent<string>): void {
    /*
     * Deserializer need to run twice to also cover hidden properties
     * which gets created in the first iteration
     */
    for (let i = 0; i < 2; i++) {
      serializers.forEach(serializer => serializer.deserialize(messageData, event));
    }
  }

  return {
    getSerializers,
    getSerializerByName,
    serialize,
    deserialize,
  };
}

