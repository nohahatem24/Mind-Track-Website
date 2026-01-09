import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { ChevronDown, Globe } from 'lucide-react';

/**
 * Language Switcher Component
 * Responsive button with dropdown for selecting languages
 * Works perfectly in both RTL and LTR modes
 */
export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES[currentLanguage];
  const otherLanguages = Object.entries(SUPPORTED_LANGUAGES)
    .filter(([code]) => code !== currentLanguage)
    .map(([code, lang]) => ({ code, ...lang }));

  const handleLanguageSelect = (code: keyof typeof SUPPORTED_LANGUAGES) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Language Button - More Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          bg-mindtrack-sage hover:bg-mindtrack-sage/90
          text-white font-bold text-base
          hover:shadow-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          z-40
          ${isRTL ? 'flex-row-reverse' : ''}
        `}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Globe size={18} className="flex-shrink-0" />
        <span className="font-bold">
          {currentLang.nativeName}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Panel */}
          <div
            className={`
              absolute top-full mt-1 w-48
              bg-white dark:bg-slate-800
              border border-gray-300 dark:border-slate-700
              rounded-lg shadow-2xl z-50
              max-h-96 overflow-y-auto
              ${isRTL ? 'right-0' : 'left-0'}
            `}
            role="menu"
          >
            {/* Current Language Section */}
            <div
              className="px-2 py-2 border-b border-gray-200 dark:border-slate-700"
              role="menuitem"
            >
              <button
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md
                  bg-blue-50 dark:bg-blue-900/30
                  text-blue-700 dark:text-blue-300
                  font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50
                  transition-colors ${isRTL ? 'flex-row-reverse' : ''}
                `}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">✓</span>
                <span>{currentLang.nativeName}</span>
              </button>
            </div>

            {/* Other Languages */}
            <div className="px-2 py-2" role="menu">
              {otherLanguages.map(({ code, nativeName, name }) => (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-md
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-slate-700
                    transition-colors duration-150
                    text-sm font-medium
                    ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}
                  `}
                  role="menuitem"
                  title={`${nativeName} (${name})`}
                >
                  <span className="text-base font-semibold">{code.toUpperCase()}</span>
                  <div className={isRTL ? 'text-right' : ''}>
                    <div className="font-medium">{nativeName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
