import * as sw from '../../src/index';
import { handle, publish, send, setExtensions } from '../../src/channel';
import Criteria from '../../src/data/Criteria';
import EntityCollection from "../../src/data/_internals/EntityCollection";
import EntityClass from "../../src/data/_internals/Entity";
import MissingPrivilegesError from '../../src/privileges/missing-privileges-error';
export interface sw_internal {
  handle: typeof handle,
  publish: typeof publish,
  send: typeof send,
  setExtensions: typeof setExtensions,
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
  handle: handle,
  publish: publish,
  send: send,
  setExtensions: setExtensions,
  Criteria: Criteria,
  Collection: EntityCollection,
  Entity: EntityClass,
  MissingPrivilegesError: MissingPrivilegesError,
}


window.sw_internal.setExtensions({
  example: {
    baseUrl: 'http://localhost:8182',
    permissions: {
      create: ['test', 'foo', 'product'],
      update: ['test', 'foo', 'product'],
      delete: ['test', 'foo', 'product'],
      read: ['test', 'foo', 'product'],
    }
  },
});