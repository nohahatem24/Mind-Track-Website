/**
 * Language Configuration
 * Based on the 72 countries in the crisis resources database
 * Only primary languages (no slangs or regional variants)
 */

export type LanguageCode = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'sv' | 'no' | 'da' | 'fi' | 'pl' | 'el' | 'ja' | 'ko' | 'hi' | 'so';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  countries: string[];
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, Language> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    countries: ['PS', 'EG', 'SA', 'AE', 'JO', 'LB', 'IQ', 'SY', 'YE', 'MA', 'DZ', 'TN', 'LY', 'SD', 'QA', 'KW', 'BH', 'OM', 'MR', 'SO', 'DJ', 'KM'],
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'IN', 'SG', 'IE', 'AE', 'SA', 'JO', 'LB', 'KW', 'BH', 'QA', 'OM'],
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    countries: ['ES', 'MX', 'AR', 'CL', 'CO'],
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    countries: ['FR', 'BE', 'CH', 'CA', 'MA', 'DZ', 'TN', 'MR', 'DJ', 'KM'],
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    countries: ['DE', 'AT', 'CH'],
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    direction: 'ltr',
    countries: ['IT', 'CH'],
  },
  pt: {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    countries: ['PT', 'BR'],
  },
  nl: {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    direction: 'ltr',
    countries: ['NL', 'BE'],
  },
  sv: {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    direction: 'ltr',
    countries: ['SE'],
  },
  no: {
    code: 'no',
    name: 'Norwegian',
    nativeName: 'Norsk',
    direction: 'ltr',
    countries: ['NO'],
  },
  da: {
    code: 'da',
    name: 'Danish',
    nativeName: 'Dansk',
    direction: 'ltr',
    countries: ['DK'],
  },
  fi: {
    code: 'fi',
    name: 'Finnish',
    nativeName: 'Suomi',
    direction: 'ltr',
    countries: ['FI'],
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    direction: 'ltr',
    countries: ['PL'],
  },
  el: {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    direction: 'ltr',
    countries: ['GR'],
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    countries: ['JP'],
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    countries: ['KR'],
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    countries: ['IN'],
  },
  so: {
    code: 'so',
    name: 'Somali',
    nativeName: 'Soomaali',
    direction: 'ltr',
    countries: ['SO'],
  },
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/**
 * Get language direction (ltr or rtl)
 */
export const getLanguageDirection = (langCode: LanguageCode): 'ltr' | 'rtl' => {
  return SUPPORTED_LANGUAGES[langCode]?.direction || 'ltr';
};

/**
 * Get all supported language codes
 */
export const getSupportedLanguageCodes = (): LanguageCode[] => {
  return Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];
};

/**
 * Get language by code
 */
export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES[code as LanguageCode];
};

/**
 * Detect language from user's browser
 */
export const detectBrowserLanguage = (): LanguageCode => {
  const browserLang = navigator.language?.split('-')[0].toLowerCase();
  const supportedCodes = getSupportedLanguageCodes();
  
  if (browserLang && supportedCodes.includes(browserLang as LanguageCode)) {
    return browserLang as LanguageCode;
  }
  
  return DEFAULT_LANGUAGE;
};
