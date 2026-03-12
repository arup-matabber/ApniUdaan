// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import ur from './locales/ur/translation.json';
import dogri from './locales/dogri/translation.json';
import gojri from './locales/gojri/translation.json';
import pahari from './locales/pahari/translation.json';
import mi from './locales/mi/translation.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ur: { translation: ur },
  dogri: { translation: dogri },
  gojri: { translation: gojri },
  pahari: { translation: pahari },
  mi: { translation: mi },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;