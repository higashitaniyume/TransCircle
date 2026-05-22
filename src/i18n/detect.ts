export type Language = "zh-CN" | "en";

export const VALID_LANGS: readonly Language[] = ["zh-CN", "en"];
export const DEFAULT_LANG: Language = "zh-CN";
export const STORAGE_KEY = "transcircle-lang";

export const detectLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANG;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_LANGS.includes(stored as Language)) {
      return stored as Language;
    }
  } catch {
    // Silently fall back to browser detection
  }

  try {
    const nav = navigator.language;
    if (nav) {
      const lower = nav.toLowerCase();
      if (lower.startsWith("zh")) return "zh-CN";
      if (lower.startsWith("en")) return "en";
    }
  } catch {
    // Silently fall back to default
  }

  return DEFAULT_LANG;
};
