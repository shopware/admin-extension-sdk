import { createSender } from '../channel';

export const dispatch = createSender('notificationDispatch');

/**
 * Dispatch a notification.
 */
export type notificationDispatch = {
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
   * Create a growl notification. Default is true.
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
    method?: () => void,
    route?: string,
    disabled?: boolean,
  }>,
}
