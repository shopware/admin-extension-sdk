import { createSender } from '../../channel';
import { getWindowSrc } from '../../_internals/utils';

export const add = createSender('uiComponentSectionRenderer', {
  src: getWindowSrc() ?? undefined,
});

/**
 * Contains all possible components for the sections
 */
export type uiComponentSectionRenderer =
 {
   responseType: void,
   component: string,
   positionId: string,
   props: unknown,
   src?: string,
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
    tabs?: cardTabRenderer[],
  },
}

interface cardTabRenderer {
  name: string,
  label: string,
  locationId: string,
}
