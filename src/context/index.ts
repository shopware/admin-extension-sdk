import { createSender } from '../channel';

export const getLanguage = createSender('languageContext', {});
export const getEnvironment = createSender('environmentContext', {});
export const getLocale = createSender('localeContext', {});
export const getCurrency = createSender('currencyContext', {});
export const getHost = createSender('hostContext', {});

/**
 * Get the current content language
 */
 export type languageContext = {
  responseType: {
    systemLanguageId: string,
    languageId: string,
    name: string,
  },
}

/**
 * Get the current environment (development or production)
 */
export type environmentContext = {
  responseType: 'development' | 'production',
}

/**
 * Get the current UI locale
 */
export type localeContext = {
  responseType: {
    locale: string,
    fallbackLocale: string,
  },
}

/**
 * Get the system currency
 */
export type currencyContext = {
  responseType: {
    systemCurrencyISOCode: string,
    systemCurrencyId: string,
  },
}

/**
 * Get the information about the host
 */
export type hostContext = {
  responseType: {
    hostUrl: string,
  },
}