import { dispatchNotification } from './notification/index';
import { redirectWindow } from './window/index';


/**
 * Contains all shopware send types.
 * @internal
 */
export type ShopwareMessageTypes = {
  getPageTitle: getPageTitle,
  dispatchNotification: dispatchNotification,
  redirectWindow: redirectWindow,
  reload: reload,
}

/**
 * @private
 * JUST FOR DEMO CASES HOW A TYPE WITHOUT OPTIONS LOOKS LIKE
 */
export type reload = {
  responseType: void
}

/**
 * @private
 * JUST FOR DEMO CASES HOW A TYPE WITH RESPONSE VALUE LOOKS LIKE
 * Get the actual page title
 */
export type getPageTitle = {
  responseType: string
}