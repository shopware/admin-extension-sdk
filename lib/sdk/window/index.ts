import { createSender } from 'lib/channel';

export const redirect = createSender('redirectWindow');

/**
   * Redirect to another URL
   */
 export type redirectWindow = {
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