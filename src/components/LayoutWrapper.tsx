import React, { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

/**
 * RTL/LTR Layout Wrapper
 * Automatically handles layout direction and styling based on language
 */
export const LayoutWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isRTL, dir } = useI18n();

  return (
    <div
      dir={dir}
      className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}
      style={{
        direction: dir,
      }}
    >
      {children}
    </div>
  );
};

export default LayoutWrapper;
