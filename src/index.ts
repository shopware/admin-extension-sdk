import * as window from './window';
import * as notification from './notification';
import * as context from './context';
import * as componentSection from './ui/componentSection';
import * as location from './location';

const ui = {
  componentSection,
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