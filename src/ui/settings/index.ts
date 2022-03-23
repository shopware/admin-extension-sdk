import { createSender } from '../../channel';
import type { icons } from '../../icons';

export const addSettingsItem = createSender('settingsItemAdd');

export type settingsItemAdd = {
    responseType: void,

    /**
     * Label of the settings item.
     */
    label: string,

    /**
     * The locationId you want to display.
     */
    locationId: string,

    /**
     * The icon to display in your settings item.
     */
    icon: icons,

    /**
     * Determines in which tab your settings item will be displayed.
     * Defaults to plugins.
     */
    tab?: 'shop' | 'system' | 'plugins',

    /**
     * Toggles the sw-page search bar on/off.
     * Defaults to true.
     */
    displaySearchBar?: boolean,
}
