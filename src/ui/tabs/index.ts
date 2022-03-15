import { createSender } from '../../channel';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default (tabPositionId: string) => ({
  addTabItem: createSender('uiTabsAddTabItem', { positionId: tabPositionId }),
});

export type uiTabsAddTabItem =
 {
   responseType: void,
   positionId: string,
   /* The label of the tab item */
   label: string,
   /* The componentSectionId for the tab content */
   componentSectionId: string,
 }
