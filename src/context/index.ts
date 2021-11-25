import { createSender } from '../channel';

export const getLanguage = createSender('contextLanguage', {});
export const getEnvironment = createSender('contextEnvironment', {});
export const getLocale = createSender('contextLocale', {});
export const getCurrency = createSender('contextCurrency', {});

/**
 * Get the current content language
 */
 export type contextLanguage = {
  responseType: {
    systemLanguageId: string,
    languageId: string,
  },
}

/**
 * Get the current environment (development or production)
 */
export type contextEnvironment = {
  responseType: 'development' | 'production' | 'testing',
}

/**
 * Get the current UI locale
 */
export type contextLocale = {
  responseType: {
    locale: string,
    fallbackLocale: string,
  },
}

/**
 * Get the system currency
 */
export type contextCurrency = {
  responseType: {
    systemCurrencyISOCode: string,
    systemCurrencyId: string,
  },
}