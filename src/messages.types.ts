import type { notificationDispatch } from './notification/index';
import type { windowRedirect, windowReload, windowRouterPush } from './window/index';
import type { contextLanguage, contextEnvironment, contextLocale, contextCurrency, contextShopwareVersion, contextAppInformation, contextModuleInformation } from './context/index';
import type { uiComponentSectionRenderer } from './ui/componentSection/index';
import type { uiTabsAddTabItem } from './ui/tabs';
import type { uiModulePaymentOverviewCard } from './ui/module/payment/overviewCard';
import type { cmsRegisterElement } from './ui/cms';
import type { extendSnippetFile } from './ui/snippet';
import type { locationUpdateHeight } from './location/index';
import type { menuItemAdd } from './ui/menu';
import type { settingsItemAdd } from './ui/settings';
import type { mainModuleAdd } from './ui/mainModule';
import type { uiModalOpen, uiModalClose } from './ui/modal/index';
import type { actionButtonAdd } from './ui/actionButton';
import type { actionExecute } from './app/action';
import type Criteria from './data/Criteria';
import type { datasetRegistration, datasetUpdate, datasetGet, datasetSubscribe } from './data';
import type EntityCollection from './data/_internals/EntityCollection';
import type { Entity } from './data/_internals/Entity';
import type {
  repositoryGet,
  repositorySearch,
  repositorySave,
  repositoryClone,
  repositoryHasChanges,
  repositorySaveAll,
  repositoryDelete,
  repositoryCreate,
} from './data/repository';

/**
 * Contains all shopware send types.
 * @internal
 */
export type ShopwareMessageTypes = {
  notificationDispatch: notificationDispatch,
  windowRedirect: windowRedirect,
  windowRouterPush: windowRouterPush,
  windowReload: windowReload,
  contextLanguage: contextLanguage,
  contextEnvironment: contextEnvironment,
  contextLocale: contextLocale,
  contextCurrency: contextCurrency,
  contextShopwareVersion: contextShopwareVersion,
  contextAppInformation: contextAppInformation,
  contextModuleInformation: contextModuleInformation,
  getPageTitle: getPageTitle,
  uiComponentSectionRenderer: uiComponentSectionRenderer,
  uiTabsAddTabItem: uiTabsAddTabItem,
  uiModulePaymentOverviewCard: uiModulePaymentOverviewCard,
  cmsRegisterElement: cmsRegisterElement,
  extendSnippetFile: extendSnippetFile,
  locationUpdateHeight: locationUpdateHeight,
  menuItemAdd: menuItemAdd,
  settingsItemAdd: settingsItemAdd,
  mainModuleAdd: mainModuleAdd,
  uiModalOpen: uiModalOpen,
  uiModalClose: uiModalClose,
  actionButtonAdd: actionButtonAdd,
  actionExecute: actionExecute,
  repositoryGet: repositoryGet,
  repositorySearch: repositorySearch,
  repositorySave: repositorySave,
  repositoryClone: repositoryClone,
  repositoryHasChanges: repositoryHasChanges,
  repositorySaveAll: repositorySaveAll,
  repositoryDelete: repositoryDelete,
  repositoryCreate: repositoryCreate,
  datasetRegistration: datasetRegistration,
  datasetSubscribe: datasetSubscribe,
  datasetUpdate: datasetUpdate,
  datasetGet: datasetGet,
  __function__: __function__,
  __registerWindow__: __registerWindow__,
  _multiply: _multiply,
  _subtract: _subtract,
  _criteriaTest: _criteriaTest,
  _collectionTest: _collectionTest,
  _entityTest: _entityTest,
  _privileges: _privileges,
}

/**
 * @private
 * JUST FOR DEMO CASES HOW A TYPE WITH RESPONSE VALUE LOOKS LIKE
 * Get the actual page title
 */
export type getPageTitle = {
  responseType: string,
}

/**
 * @private
 * JUST FOR TEST CASES
 */
export type _multiply = {
  responseType: number,
  firstNumber: number,
  secondNumber: number,
}

export type _subtract = {
  responseType: number,
  firstNumber: number,
  secondNumber: number,
}

export type _privileges = {
  responseType: void,
}

export type _criteriaTest = {
  responseType: {
    title: string,
    myCriteria: Criteria,
  },
  title: string,
  myCriteria: Criteria,
}

export type _collectionTest = {
  responseType: {
    title: string,
    collection: EntityCollection,
  },
  title: string,
  collection: EntityCollection,
}

export type _entityTest = {
  responseType: {
    title: string,
    entity: Entity,
  },
  title: string,
  entity: Entity,
}

export type __function__ = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseType: any,
  args: unknown[],
  id: string,
}

export type __registerWindow__ = {
  responseType: void,
}
