import * as sw from '../../src/index';
import { handleFactory, publish, send } from '../../src/channel';
import Criteria from '../../src/data/Criteria';

export interface sw_internal {
  handleFactory: typeof handleFactory,
  publish: typeof publish,
  send: typeof send,
  Criteria: typeof Criteria,
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
}