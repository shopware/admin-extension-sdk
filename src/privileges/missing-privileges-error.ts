import { ShopwareMessageTypes } from '../messages.types';

export default class MissingPrivilegesError extends Error {
  missingPrivileges: Array<string>;

  constructor(messageType: keyof ShopwareMessageTypes, missingPrivileges: Array<string>) {
    super(`Your app is missing the priviliges ${missingPrivileges.join(', ')} for action "${messageType}".`);

    this.missingPrivileges = missingPrivileges;

    // Set prototype excplicitly
    Object.setPrototypeOf(this, MissingPrivilegesError.prototype);
  }
}