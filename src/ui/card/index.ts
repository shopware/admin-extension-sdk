import { createSender } from '../../channel';

export const uiCard = (positionId: string) => ({
  addComponentBefore: createSender('uiComponentRender', { positionId: positionId + '__before' }),
  addComponentAfter: createSender('uiComponentRender', { positionId: positionId + '__after' }),
});