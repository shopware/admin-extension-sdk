import type { ShopwareMessageTypes } from '../messages.types';
import type { privilegeString } from './privilege-resolver';

type type = '__MissingPrivilegesError__';

interface MissingPrivilegeErrorJson {
  __type__ : type,
  __messageType__: string,
  __data__: string[],
}

export default class MissingPrivilegesError extends Error {
  missingPrivileges: Array<privilegeString>;

  messageType: keyof ShopwareMessageTypes;

  constructor(messageType: keyof ShopwareMessageTypes, missingPrivileges: Array<privilegeString>) {
    super(`Your app is missing the privileges ${missingPrivileges.join(', ')} for action "${messageType}".`);

    this.missingPrivileges = missingPrivileges;

    this.messageType = messageType;

    // Set prototype explicitly
    Object.setPrototypeOf(this, MissingPrivilegesError.prototype);
  }

  toJSON(): MissingPrivilegeErrorJson {
    return {
      __type__: '__MissingPrivilegesError__',
      __messageType__: this.messageType,
      __data__: this.missingPrivileges,
    };
  }
}
