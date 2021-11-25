import { createSender } from '../channel';

export const redirect = createSender('windowRedirect');
export const reload = createSender('windowReload', {});

/**
 * Redirect to another URL
 */
export type windowRedirect = {
  responseType: void,
  /**
   * The URL for the redirection
   */
  url: string,
  /**
   * If this is activated then the link will be opened in a new tab
   */
  newTab?: boolean,
}

/**
 * Reload the current window
 */
export type windowReload = {
  responseType: void,
}