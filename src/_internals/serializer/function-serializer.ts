import type { SerializerFactory } from '.';
import { isObject, generateUniqueId } from '../utils';

/* eslint-disable */
const FunctionSerializerFactory: SerializerFactory = ({ send, handle }) => {
  // only available on sender side
  const methodRegistry: {
    [key: string]: (...args: any[]) => any
  } = {};

  let isMethodHandlerStarted = false;

  function startMethodHandler() {
    if (isMethodHandlerStarted) return;
    isMethodHandlerStarted = true;

    handle('__function__', async ({ args, id }) => {
      return await Promise.resolve(methodRegistry[id](...args));
    })
  }

  return {
    name: 'function',

    serialize: ({ value }): any => {
      if (typeof value === 'function') {
        const id = generateUniqueId();
        // add the method reference to the methodRegistry
        methodRegistry[id] = value;
    
        // start a general function listener which calls the method when the handler calls the method
        startMethodHandler();
    
        // replace function with a object containing the type and id
        return {
          __type__: '__function__',
          id: id,
          origin: window.origin,
        }
      }
    },

    deserialize: ({ value, event }): any => {
      // @ts-expect-error
      const targetWindow: Window = event?.source ?? window;
  
      // when object is containing a method wrapper
      if (isObject(value)
          && value['__type__']
          && value['__type__'] === '__function__'
          && typeof value['id'] === 'string'
      ) {
        const id = value['id'];
        const origin = value['origin'];
  
        // convert wrapper to a callable method
        return (...args: any[]) => {
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
    }
  }
}

export default FunctionSerializerFactory;