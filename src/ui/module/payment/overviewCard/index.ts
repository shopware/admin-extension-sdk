import { createSender } from '../../../../channel';

export const add = createSender('uiModulePaymentOverviewCard');

/**
 * Contains all necessary parameters to render a component in the payment overview
 */
export type uiModulePaymentOverviewCard = {
  responseType: void,
  component?: string,
  positionId: string,
  paymentMethodHandlers: string[],
}
