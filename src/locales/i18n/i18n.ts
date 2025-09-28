import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

import english from "./langs/en.json";
import spanish from "./langs/es.json";
import portuguese from "./langs/pt.json";

const resources = {
  pt: {
    translation: portuguese,
  },
  en: {
    translation: english,
  },
  es: {
    translation: spanish,
  },
};

void i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    debug: false,
    fallbackLng: "pt",
    interpolation: {
      escapeValue: true,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
