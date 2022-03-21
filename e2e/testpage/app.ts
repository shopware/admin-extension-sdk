import * as sw from '../../src/index';
import { handleFactory, publish, send } from '../../src/channel';
import Criteria from '../../src/data/Criteria';
import EntityCollection from "../../src/data/_internals/EntityCollection";
import EntityClass from "../../src/data/_internals/Entity";
import MissingPrivilegesError from '../../src/privileges/missing-privileges-error';
export interface sw_internal {
  handleFactory: typeof handleFactory,
  publish: typeof publish,
  send: typeof send,
  Criteria: typeof Criteria,
  Collection: typeof EntityCollection,
  MissingPrivilegesError: typeof MissingPrivilegesError
  Entity: typeof EntityClass,
}

declare global {
  interface Window {
    sw: typeof sw;
    sw_internal: sw_internal
  }
}

window.sw = sw;
window.sw_internal = {
  handleFactory: handleFactory,
  publish: publish,
  send: send,
  Criteria: Criteria,
  Collection: EntityCollection,
  Entity: EntityClass,
  MissingPrivilegesError: MissingPrivilegesError,
}
