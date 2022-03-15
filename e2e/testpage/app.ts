import * as sw from '../../src/index';
import { handleFactory, publish, send } from '../../src/channel';
import Criteria from '../../src/data/Criteria';
import EntityCollection from "../../src/data/_internals/EntityCollection";
import EntityClass, { Entity }  from "../../src/data/_internals/Entity";

export interface sw_internal {
  handleFactory: typeof handleFactory,
  publish: typeof publish,
  send: typeof send,
  Criteria: typeof Criteria,
  Collection: typeof EntityCollection,
  Entity: Entity,
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
  // @ts-expect-error
  Entity: EntityClass,
}
