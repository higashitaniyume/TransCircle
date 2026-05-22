import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { detectLanguage } from "./detect";
import zhCN from "./locales/zh-CN/translation.json";
import en from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    "zh-CN": { translation: zhCN },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: "zh-CN",
  interpolation: {
    escapeValue: false,
  },
  returnObjects: false,
  returnNull: false,
});

export default i18n;
