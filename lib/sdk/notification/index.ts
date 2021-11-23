import { createSender } from 'lib/channel';

export const dispatch = createSender('dispatchNotification');