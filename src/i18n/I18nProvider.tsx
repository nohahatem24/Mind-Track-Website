/**
 * Internationalization Context and Provider
 * Manages language state, translations, and RTL/LTR switching
 */

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { LanguageCode, getLanguageDirection, DEFAULT_LANGUAGE, detectBrowserLanguage } from './languages';
import translations from './translations';

// Type for translations object
type TranslationsType = typeof translations;

interface I18nContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultValue?: string) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * I18n Provider Component
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setLanguageState] = useState<LanguageCode>(() => {
    // Try to load saved language from localStorage
    const saved = localStorage.getItem('preferredLanguage') as LanguageCode | null;
    if (saved) return saved;
    
    // Try to detect from browser
    return detectBrowserLanguage();
  });

  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [isRTL, setIsRTL] = useState(false);

  /**
   * Set language and update localStorage, DOM, and direction
   */
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLanguage', lang);
    
    const direction = getLanguageDirection(lang);
    setDir(direction);
    setIsRTL(direction === 'rtl');
    
    // Update HTML dir attribute
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;
    
    // Update document class for CSS styling
    document.documentElement.classList.remove('rtl', 'ltr');
    document.documentElement.classList.add(direction);
  };

  /**
   * Translation function - get translated string by key
   */
  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage] || translations[DEFAULT_LANGUAGE];
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : (defaultValue || key);
  };

  // Initialize on first load
  useEffect(() => {
    const direction = getLanguageDirection(currentLanguage);
    setDir(direction);
    setIsRTL(direction === 'rtl');
    document.documentElement.dir = direction;
    document.documentElement.lang = currentLanguage;
    document.documentElement.classList.remove('rtl', 'ltr');
    document.documentElement.classList.add(direction);
  }, [currentLanguage]);

  const value: I18nContextType = {
    currentLanguage,
    setLanguage,
    t,
    dir,
    isRTL,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use i18n context
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

/**
 * Hook to use translation function
 */
export function useTranslation() {
  const { t, currentLanguage } = useI18n();
  return { t, lang: currentLanguage };
}

/**
 * Hook to check if RTL
 */
export function useIsRTL(): boolean {
  const { isRTL } = useI18n();
  return isRTL;
}

/**
 * Hook to get text direction
 */
export function useTextDirection(): 'ltr' | 'rtl' {
  const { dir } = useI18n();
  return dir;
}
