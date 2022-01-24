import { createSender } from '../../channel';

export const add = createSender('actionButtonAdd');

/**
 * Add an ActionButton.
 */
export type actionButtonAdd = {
    responseType: void,

    /**
     * Unique identifier for the action.
     */
    name: string,

    /**
     * Defines which entity you're working on.
     */
    entity: 'product' | 'order' | 'category' | 'promotion' | 'customer',

    /**
     * Where the button should be added to.
     * "detail" for the detail page
     * "list" for the entity listing
     */
    view: 'detail' | 'list',

    /**
     * Label of your action button.
     */
    label: string,

    /**
     * Callback function which will be called once the action button is clicked.
     */
    callback: (entity: string, entityIdList: string[]) => void,
}
