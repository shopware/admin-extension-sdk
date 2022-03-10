import { send, handleFactory } from '../channel';
import { traverseObject, isObject, generateUniqueId } from './utils';

/* eslint-disable */
export function serializeFunctionsInMessageData<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  serializeMethodsWithPlaceholder(messageData);
}

export function deserializeFunctionsInMessageData<MESSAGE_DATA extends object>(
  messageData: MESSAGE_DATA,
  event: MessageEvent<string>
): void {
  deserializeMethodsWithPlaceholder(messageData, event);
}

// only available on sender side
const methodRegistry: {
  [key: string]: (...args: any[]) => any
} = {};

let isMethodHandlerStarted = false;

function startMethodHandler() {
  if (isMethodHandlerStarted) return;
  isMethodHandlerStarted = true;

  const handle = handleFactory({})
  handle('__function__', async ({ args, id }) => {
    return await Promise.resolve(methodRegistry[id](...args));
  })
}

function serializeMethodsWithPlaceholder<MESSAGE_DATA extends object>(messageData: MESSAGE_DATA): void {
  traverseObject(messageData, (parentEntry, key, value) => {
    if (typeof value === 'function') {
      const id = generateUniqueId();
      // add the method reference to the methodRegistry
      methodRegistry[id] = value;

      // replace function with a object containing the type and id
      parentEntry[key] = {
        __type__: '__function__',
        id: id,
        origin: window.origin,
      }

      // start a general function listener which calls the method when the handler calls the method
      startMethodHandler();
    }
  });
}

// the receiver don't have access to the methodRegistry
function deserializeMethodsWithPlaceholder<MESSAGE_DATA extends object>(
  messageData: MESSAGE_DATA,
  event: MessageEvent<string>
): void {
  // @ts-expect-error
  const targetWindow: Window = event.source ?? window;

  traverseObject(messageData, (parentEntry, key, value) => {
    // when object is containing a method wrapper
    if (isObject(value)
        && value['__type__']
        && value['__type__'] === '__function__'
        && typeof value['id'] === 'string'
    ) {
      const id = value['id'];
      const origin = value['origin'];

      // convert wrapper to a callable method
      parentEntry[key] = (...args: any[]) => {        
        return send(
          '__function__',
          {
            args: args,
            id: id,
          },
          targetWindow,
          origin
        );
      };
    }
  });
}