import { createSender } from '../../channel';

export const open = createSender('uiModalOpen');
export const close = createSender('uiModalClose');

export type uiModalOpen =
 {
   responseType: void,
   title: string,
   locationId: string,
   variant?: 'default'|'small'|'large'|'full',
   showHeader?: boolean,
   closable?: boolean,
   buttons?: buttonProps[],
 }

export type uiModalClose =
 {
   responseType: void,
   locationId: string,
 }

export type buttonProps = {
  method: () => void,
  label: string,
  variant?: 'primary'|'ghost'|'danger'|'ghost-danger'|'contrast'|'context',
  size?: 'x-small'|'small'|'large',
  square?: boolean,
}
