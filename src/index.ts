import * as window from './window';
import * as notification from './notification';
import * as context from './context';
import * as componentSection from './ui/componentSection';
import tabs from './ui/tabs';
import * as location from './location';
import * as menu from './ui/menu';
import * as settings from './ui/settings';
import * as mainModule from './ui/mainModule';
import * as modal from './ui/modal';
import * as actionButton from './ui/actionButton';
import * as webhook from './app/action';
import repository from './repository';

const app = {
  webhook,
};

const ui = {
  componentSection,
  tabs,
  menu,
  settings,
  mainModule,
  modal,
  actionButton,
};

/**
 * The main export which will be available by direct imports.
 */
export {
  window,
  notification,
  context,
  ui,
  location,
  app,
  repository,
};
