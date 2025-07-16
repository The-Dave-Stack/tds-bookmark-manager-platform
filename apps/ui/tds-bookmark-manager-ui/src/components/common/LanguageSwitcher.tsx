/**
 * LanguageSwitcher.tsx
 *
 * Purpose:
 * - Provides a UI component for users to switch between supported languages (English and Spanish).
 * - Integrates with `react-i18next` for language management.
 *
 * Logic Overview:
 * 1. Defines `LANGUAGES` object mapping language codes to their names and flags.
 * 2. Uses `useState` to manage the dropdown's open/closed state.
 * 3. Uses `useTranslation` to access the current language and `changeLanguage` function from `i18n`.
 * 4. `currentLanguage`: Determines the currently active language, defaulting to English if an unsupported language is set.
 * 5. `changeLanguage`: Updates the `i18n` language and closes the dropdown.
 * 6. Renders a main button displaying the current language's flag and name, which toggles the dropdown.
 * 7. Conditionally renders a dropdown menu when `isOpen` is true.
 * 8. Maps over `LANGUAGES` to render each language option as a clickable button within the dropdown.
 * 9. Applies active styling to the currently selected language option.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { useState } from 'react';

import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' }
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = LANGUAGES[i18n.language as keyof typeof LANGUAGES] || LANGUAGES.en;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };
  
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-mainText bg-invertedText border border-lightBorder rounded-md shadow-sm hover:bg-lightBg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-5 w-5 mr-2 text-primary" />
        <span className="mr-1">{currentLanguage.flag}</span>
        <span className="mr-2">{currentLanguage.name}</span>
        <ChevronDown className="h-4 w-4 text-primary" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-invertedText ring-1 ring-lightBorder">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
              <button
                key={code}
                role="menuitem" // Add role for better accessibility and testing
                className={`w-full text-left px-4 py-2 text-sm hover:bg-lightBg flex items-center transition-colors duration-200 ${
                  i18n.language === code 
                    ? 'text-primary bg-lightBg font-medium' 
                    : 'text-mainText'
                }`}
                onClick={() => changeLanguage(code)}
              >
                <span className="mr-2">{flag}</span>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
