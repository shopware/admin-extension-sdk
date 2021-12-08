import { createSender } from '../../channel';

export const add = createSender('uiComponentSectionRenderer');

/**
 * Contains all possible components for the sections
 */
 export type uiComponentSectionRenderer =
 {
   responseType: void,
   component: string,
   positionId: string,
   props: unknown,
 } &
 (
   cardComponentRender
   /**
    * Here you can add multiple component types. Add with "|" so that only one will get used.
    */
)

interface cardComponentRender {
  component: 'card',
  props: {
    title?: string,
    subtitle?: string,
    locationId: string,
  },
}