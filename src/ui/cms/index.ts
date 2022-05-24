import { createSender } from '../../channel';

export const registerCmsElement = createSender('cmsRegisterElement');

export type cmsRegisterElement = {
    responseType: void,

    /**
     * The unique name of the cms element, which will also be used to generate locationIds - Should have vendor prefix
     *
     * @example 'company-my-image-slider' will result in the location ids:
     * - 'company-my-image-slider-element' for the element in the cms itself
     * - 'company-my-image-slider-preview' for the preview in the cms element selection
     * - 'company-my-image-slider-config' for the configuration modal of a placed element
     */
    name: string,

    /**
     * The label, which is visible when selecting the cms element - Use snippet keys here!
     */
    label: string,

    /**
     * Object containing the defaultConfig; same like in plugin development.
     * @url https://developer.shopware.com/docs/guides/plugins/plugins/content/cms/add-cms-element
     */
    defaultConfig: {
        [key: string]: unknown,
    },
};
