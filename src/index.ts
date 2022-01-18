import * as window from './window';
import * as notification from './notification';
import * as context from './context';
import * as componentSection from './ui/componentSection';
import tabs from './ui/tabs';
import * as location from './location';
import * as menu from './ui/menu';
import * as settings from './ui/settings';
import * as mainModule from './ui/mainModule';

const ui = {
  componentSection,
  tabs,
  menu,
  settings,
  mainModule,
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
};
