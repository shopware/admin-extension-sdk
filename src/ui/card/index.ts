import { createSender } from '../../channel';

export default (positionId: string) => ({
  addComponentBefore: createSender('uiComponentRender', { positionId: positionId + '__before' }),
  addComponentAfter: createSender('uiComponentRender', { positionId: positionId + '__after' }),
});