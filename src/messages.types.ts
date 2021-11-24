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
  __function__: __function__,
  _multiply: _multiply,
  _subtract: _subtract,
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

export type __function__ = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responseType: any,
  args: unknown[],
  id: string,
}