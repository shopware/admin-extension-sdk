import { createSender } from '../../channel';

export const extendFile = createSender('extendSnippetFile');

export type Snippets = {
  [key: string]: string|Snippets,
};

export type extendSnippetFile = {
  responseType: void,

  /**
   * Locale string of the language to be extended
   *
   * @example en-GB
   */
  locale: string,

  /**
   * Snippet json, which extends the translations of the aforementioned locale
   *
   * @url https://developer.shopware.com/docs/guides/plugins/plugins/administration/adding-snippets
   */
  snippets: Snippets,
};
