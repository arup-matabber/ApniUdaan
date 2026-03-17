// languageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import { I18nextProvider } from 'react-i18next';
import en from "../../locales/en/translation.json";
import hi from "../../locales/hi/translation.json";
import ur from "../../locales/ur/translation.json";
import dogri from "../../locales/dogri/translation.json";
import gojri from "../../locales/gojri/translation.json";
import pahari from "../../locales/pahari/translation.json";
import mi from "../../locales/mi/translation.json";

i18n.use(initReactI18next).init({
  resources: { 
    en: { translation: en },
    hi: { translation: hi },
    ur: { translation: ur },
    dogri: { translation: dogri },
    gojri: { translation: gojri },
    pahari: { translation: pahari },
    mi: { translation: mi}
  },
  lng: localStorage.getItem("apni_disha_lang") || "en",
  fallbackLng: "en",
  supportedLngs: ["en", "hi", "ur", "dogri", "gojri", "pahari", "mi"],
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added',
  },
});


const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [forceRender, setForceRender] = useState(0);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("apni_disha_lang", lng);
    setLanguage(lng);
  };

  // Removed the redundant useEffect that re-calls changeLanguage

  useEffect(() => {
    const handleLanguageChanged = () => setForceRender(prev => prev + 1);
    const handleLoaded = () => setForceRender(prev => prev + 1);

    i18n.on('languageChanged', handleLanguageChanged);
    i18n.on('loaded', handleLoaded);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
      i18n.off('loaded', handleLoaded);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n} key={forceRender}>  {/* Test removing 'key={forceRender}' if issues persist */}
        {children}
      </I18nextProvider>
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => useContext(LanguageContext);