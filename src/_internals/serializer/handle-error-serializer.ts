import type { SerializerFactory } from './index';
import { hasType } from '../utils';
import HandleError from '../error-handling/HandleError';

/* eslint-disable */
const HandleErrorSerializerFactory: SerializerFactory = () => ({
  name: 'handle-error',

  // serialize is empty because the error contains a toJSON function
  serialize: (): any => {},

  deserialize: ({ value }): any => {
    if (hasType('__HandleError__', value)) {
      return new HandleError(
        value.__message__,
        value.__code__,
      );
    }
  },
});

export default HandleErrorSerializerFactory;
