import { _privileges } from './messages/_privileges';

/**
 * Determines which privileges are needed for a certain message type.
 * @internal
 */
export const ShopwareMessageTypePrivileges = {
  notificationDispatch: {},
  windowRedirect: {},
  windowReload: {},
  contextLanguage: {},
  contextEnvironment: {},
  contextLocale: {},
  contextCurrency: {},
  getPageTitle: {},
  uiComponentSectionRenderer: {},
  uiTabsAddTabItem: {},
  locationUpdateHeight: {},
  menuItemAdd: {},
  settingsItemAdd: {},
  __function__: {},
  __registerWindow__: {},
  _multiply: {},
  _subtract: {},
  _privileges: _privileges,
};