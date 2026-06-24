import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importar recursos
import en from "./locales/en.json";
import es from "./locales/es.json";
export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const getDeviceLanguage = (): SupportedLanguage => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const languageCode = locale.split("-")[0];

    if (
      languageCode &&
      SUPPORTED_LANGUAGES.includes(languageCode as SupportedLanguage)
    ) {
      return languageCode as SupportedLanguage;
    }
  } catch (error) {
    console.warn("[i18n] Error detecting device language:", error);
  }

  return "es";
};

const INITIAL_LANGUAGE = getDeviceLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: INITIAL_LANGUAGE,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
  react: {
    useSuspense: false,
  },
});

export default i18n;

// ============================================================================
// Helpers
// ============================================================================
export const changeLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);
};

export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};
