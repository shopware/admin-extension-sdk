/**
 * Contains all shopware send types.
 * @internal
 */
export type ShopwareMessageTypes = {
  getPageTitle: getPageTitle,
  createAlert: createAlert,
  redirect: redirect,
  reload: reload,
}

/**
   * Create a alert notification.
   */
 export type createAlert = {
  responseType: void,
  /**
   * This message will be shown in the alert
   */
  message: string
}

/**
   * Redirect to another URL
   */
export type redirect = {
  responseType: void,
  /**
   * The URL for the redirection
   */
  url: string,
  /**
   * If this is activated then the link will be opened in a new tab
   */
  newTab?: boolean
}

/**
 * Reload the current page. Also useful if the iframe uses a watcher. Then it can trigger a reload
 * on the administration.
 */
export type reload = {
  responseType: void
}

/**
 * Get the actual page title
 */
export type getPageTitle = {
  responseType: string
}