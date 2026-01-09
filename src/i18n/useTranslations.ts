import { useI18n } from './I18nProvider';
import translations from './translations';

/**
 * Hook to easily access translations in components
 * Usage: const t = useTranslations('dashboard')
 * Then use: t.welcome, t.title, etc.
 */
export const useTranslations = (namespace?: keyof typeof translations.en) => {
  const { currentLanguage } = useI18n();
  const langTranslations = translations[currentLanguage as keyof typeof translations];

  if (namespace) {
    return langTranslations[namespace as keyof typeof langTranslations] || {};
  }

  return langTranslations;
};

/**
 * Get a specific translation string by path
 * Usage: t('dashboard.welcome')
 */
export const useTranslation = () => {
  const { currentLanguage } = useI18n();
  const langTranslations = translations[currentLanguage as keyof typeof translations];

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = langTranslations;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path; // Return path if translation not found (fallback)
      }
    }

    return typeof current === 'string' ? current : path;
  };

  return { t, currentLanguage };
};
