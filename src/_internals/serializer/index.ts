import FunctionSerializer from './function-serializer';
import CriteriaSerializer from './criteria-serializer';
import EntitySerializer from './entity-serializer';
import EntityCollectionSerializer from './entity-collection-serializer';

type serializeFunction = <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA) => void;
type deserializeFunction = (<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA) => void) |
  (<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA, event: MessageEvent<string>) => void);

export interface serializer {
  name: string,
  serialize: serializeFunction,
  deserialize: deserializeFunction,
}

const serializers: serializer[] = [
  FunctionSerializer,
  CriteriaSerializer,
  EntitySerializer,
  EntityCollectionSerializer,
];

export function getSerializers(): serializer[] {
  return serializers;
}

export function getSerializerByName(name: string): serializer | null {
  return serializers.find(serializer => serializer.name === name) ?? null;
}

export function serialize <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  serializers.forEach(serializer => serializer.serialize(messageData));
}

export function deserialize <MESSAGE_DATA extends object>(messageData: MESSAGE_DATA, event: MessageEvent<string>): void {
  serializers.forEach(serializer => {
    serializer.deserialize(messageData, event);
  });
}
