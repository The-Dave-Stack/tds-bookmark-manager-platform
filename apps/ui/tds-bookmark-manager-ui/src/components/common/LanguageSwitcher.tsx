import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

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