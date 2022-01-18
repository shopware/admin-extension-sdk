import { createSender } from '../../channel';

export const addMainModule = createSender('mainModuleAdd');

export type mainModuleAdd = {
    responseType: void,

    /**
     * Heading of the main module.
     */
    heading: string,

    /**
     * The locationId you want to display.
     */
    locationId: string,

    /**
     * Toggles the sw-page search bar on/off.
     * Defaults to true.
     */
    displaySearchBar?: boolean,
}
