import { createSender } from '../../channel';

export const actionExecute = createSender('actionExecute');

export type actionExecute = {
    responseType: void,

    /**
     * The webhook url of your app.
     */
    url: string,

    /**
     * The payload you want to send.
     */
    entityIds: string[],

    /**
     * The entity this action is for.
     */
    entity: string,
};
