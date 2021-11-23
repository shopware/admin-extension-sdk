/**
 * Contains all shopware send types.
 * @internal
 */
export type ShopwareMessageTypes = {
  getPageTitle: getPageTitle,
  dispatchNotification: dispatchNotification,
  redirect: redirect,
  reload: reload,
}

/**
   * Dispatch a notification.
   */
 export type dispatchNotification = {
  responseType: void,
  /**
   * This message will be shown in the notification.
   * HTML syntax can be used but it will be sanitized. 
   * Only some basic tags and attributes can be used.
   */
  message: string,

  /**
   * The title of the notification
   */
  title: string,

  /**
   * Create a growl notification
   */
  growl?: boolean,

  /**
   * The variant of the notification
   */
  variant?: 'success' | 'info' | 'warning' | 'error',

  /**
   * There are two types of notification styles. Use
   * "system" only for technical application notifications.
   */
  appearance?: 'system' | 'notification',

  /**
   * You can add several action buttons to the notification.
   * Each button contains a route (url) which gets opened on
   * a click.
   */
  actions?: Array<{
    label: string,
    route: string,
    disabled?: boolean,
    newTab?: boolean,
  }>
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