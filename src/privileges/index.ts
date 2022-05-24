import { _privileges } from './messages/_privileges';
import type { privileges } from './privilege-resolver';

/**
 * Determines which privileges are needed for a certain message type.
 * @internal
 */
export const ShopwareMessageTypePrivileges: Record<string, privileges> = {
  notificationDispatch: {},
  windowRedirect: {},
  windowReload: {},
  contextLanguage: {},
  contextEnvironment: {},
  contextLocale: {},
  contextCurrency: {},
  contextShopwareVersion: {},
  contextAppInformation: {},
  getPageTitle: {},
  uiComponentSectionRenderer: {},
  uiTabsAddTabItem: {},
  cmsRegisterElement: {},
  locationUpdateHeight: {},
  menuItemAdd: {},
  settingsItemAdd: {},
  mainModuleAdd: {},
  uiModalOpen: {},
  uiModalClose: {},
  actionButtonAdd: {},
  actionExecute: {},
  datasetRegistration: {},
  datasetSubscribe: {},
  datasetUpdate: {},
  __function__: {},
  __registerWindow__: {},
  _criteriaTest: {},
  _collectionTest: {},
  _multiply: {},
  _subtract: {},
  _privileges: _privileges,
};
