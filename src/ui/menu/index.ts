import { createSender } from '../../channel';

export const addMenuItem = createSender('menuItemAdd');

export type menuItemAdd = {
  responseType: void,

  /**
   * Label of the menu item.
   */
  label: string,

  /**
   * The locationId you want to display.
   */
  locationId: string,

  /**
   * Toggles the sw-page search bar on/off.
   * Defaults to true.
   */
  displaySearchBar?: boolean,

  /**
   * Determines under which main menu entry your item is displayed.
   * Defaults to `sw-extension`.
   */
  parent?: string,

  /**
   * Determines the position of your menu item.
   * Defaults to 110.
   */
  position?: number,
}
