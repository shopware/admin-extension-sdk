import type { SerializerFactory } from './index';
import { hasType } from '../utils';
import MissingPrivilegesError from '../../privileges/missing-privileges-error';

/* eslint-disable */
const MissingPrivilegesErrorSerializer: SerializerFactory = () => ({
  name: 'handle-error',

  // serialize is empty because the error contains a toJSON function
  serialize: (): any => {},

  deserialize: ({ value }): any => {
    if (hasType('__MissingPrivilegesError__', value)) {
      return new MissingPrivilegesError(
        value.__messageType__,
        value.__data__,
      );
    }
  },
});

export default MissingPrivilegesErrorSerializer;
