import { createSender } from '../../channel';

export const render = createSender('uiComponentRender');

/**
 * Get the current content language
 */
 export type uiComponentRender =
 {
   responseType: void,
   component: string,
   positionId: string,
   locationId: string,
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
  },
}