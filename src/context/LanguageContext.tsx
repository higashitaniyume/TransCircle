import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "../i18n/detect";
import { VALID_LANGS, DEFAULT_LANG, STORAGE_KEY } from "../i18n/detect";

export type { Language };

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const validateLang = (value: string | null): Language => {
  if (value && VALID_LANGS.includes(value as Language)) {
    return value as Language;
  }
  return DEFAULT_LANG;
};

const getStoredLang = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const setStoredLang = (lang: Language): void => {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Silently ignore write failures
  }
};

const clearStoredLang = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
};

const applyLang = (lang: Language): void => {
  document.documentElement.lang = lang;
};

const detectBrowserLang = (): Language => {
  try {
    const nav = navigator.language;
    if (nav) {
      const lower = nav.toLowerCase();
      if (lower.startsWith("zh")) return "zh-CN";
      if (lower.startsWith("en")) return "en";
    }
  } catch {
    // Silently fall back
  }
  return DEFAULT_LANG;
};

const getInitialLang = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANG;

  const stored = getStoredLang();
  if (stored) {
    const valid = validateLang(stored);
    if (valid === stored) {
      return valid;
    }
    clearStoredLang();
    return DEFAULT_LANG;
  }

  return detectBrowserLang();
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLang);
  const { i18n, t } = useTranslation();

  const syncMetaTags = useCallback(
    (lang: Language) => {
      document.title = t("meta.title");
      const setMeta = (selector: string, content: string) => {
        const el = document.querySelector(selector);
        if (el) el.setAttribute("content", content);
      };
      setMeta('meta[name="description"]', t("meta.description"));
      setMeta('meta[property="og:title"]', t("meta.title"));
      setMeta('meta[property="og:description"]', t("meta.description"));
      setMeta('meta[property="og:locale"]', lang === "zh-CN" ? "zh_CN" : "en_US");
      setMeta('meta[name="twitter:title"]', t("meta.title"));
      setMeta('meta[name="twitter:description"]', t("meta.description"));
    },
    [t]
  );

  const setLanguage = useCallback(
    (newLang: Language) => {
      const valid = validateLang(newLang);
      setLanguageState(valid);
      setStoredLang(valid);
      applyLang(valid);
      i18n.changeLanguage(valid);
    },
    [i18n]
  );

  useEffect(() => {
    applyLang(language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    syncMetaTags(language);
  }, [language, syncMetaTags]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
