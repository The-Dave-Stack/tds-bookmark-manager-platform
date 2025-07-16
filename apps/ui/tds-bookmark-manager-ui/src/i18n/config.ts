/**
 * config.ts
 *
 * Purpose:
 * - Configures the `i18next` internationalization library for the React application.
 * - Loads translation files and sets up default language and interpolation options.
 *
 * Logic Overview:
 * 1. Imports `i18n` from `i18next` and `initReactI18next` from `react-i18next`.
 * 2. Imports English (`en.json`) and Spanish (`es.json`) translation files.
 * 3. Uses `initReactI18next` to bind `i18next` with React.
 * 4. Initializes `i18n` with:
 *    - `resources`: Mapping language codes to their respective translation files.
 *    - `lng`: Sets the default language to 'en'.
 *    - `fallbackLng`: Specifies 'en' as the fallback language if a translation is missing.
 *    - `interpolation`: Disables escaping of values, as React handles this by default.
 * 5. Exports the configured `i18n` instance for use throughout the application.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
