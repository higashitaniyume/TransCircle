import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const LANG_KEY = "transcircle-lang";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <ThemeProvider>{ui}</ThemeProvider>
    </LanguageProvider>
  );
};

describe("i18n system", () => {
  beforeEach(() => {
    document.documentElement.lang = "";
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("LanguageContext", () => {
    it("should detect en from browser language when localStorage is empty (jsdom default)", () => {
      renderWithProviders(<div data-testid="child"></div>);
      // jsdom's navigator.language defaults to "en-US", so browser detection picks "en"
      expect(document.documentElement.lang).toBe("en");
    });

    it("should respect valid stored language 'en'", () => {
      localStorage.setItem(LANG_KEY, "en");
      renderWithProviders(<div data-testid="child"></div>);
      expect(document.documentElement.lang).toBe("en");
    });

    it("should fallback to zh-CN for invalid stored values", () => {
      localStorage.setItem(LANG_KEY, "fr");
      renderWithProviders(<div data-testid="child"></div>);
      expect(document.documentElement.lang).toBe("zh-CN");
    });

    it("should clean up invalid stored language values", () => {
      localStorage.setItem(LANG_KEY, "invalid");
      renderWithProviders(<div data-testid="child"></div>);
      expect(localStorage.getItem(LANG_KEY)).toBeNull();
    });

    it("should gracefully handle localStorage read errors", () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error("Storage disabled");
      });

      renderWithProviders(<div data-testid="child"></div>);
      // Falls back to browser detection, jsdom's navigator.language is "en-US"
      expect(document.documentElement.lang).toBe("en");

      localStorage.getItem = originalGetItem;
    });
  });

  describe("LanguageSwitcher", () => {
    it("should render with switch-to label for the other language", () => {
      localStorage.setItem(LANG_KEY, "zh-CN");
      renderWithProviders(<LanguageSwitcher />);
      // Default zh-CN: button shows "EN" (target language)
      expect(screen.getByRole("button", { name: "切换到英文" })).toBeInTheDocument();
    });

    it("should show 中文 when current language is en", () => {
      localStorage.setItem(LANG_KEY, "en");
      renderWithProviders(<LanguageSwitcher />);
      expect(screen.getByRole("button", { name: "Switch to Chinese" })).toBeInTheDocument();
    });

    it("should toggle language on click and update document.lang", () => {
      localStorage.setItem(LANG_KEY, "zh-CN");
      renderWithProviders(<LanguageSwitcher />);

      const btn = screen.getByRole("button", { name: "切换到英文" });
      fireEvent.click(btn);

      expect(document.documentElement.lang).toBe("en");
      expect(localStorage.getItem(LANG_KEY)).toBe("en");
    });

    it("should toggle back to zh-CN on second click", () => {
      localStorage.setItem(LANG_KEY, "zh-CN");
      renderWithProviders(<LanguageSwitcher />);

      const btn = screen.getByRole("button", { name: "切换到英文" });
      fireEvent.click(btn);
      expect(document.documentElement.lang).toBe("en");

      fireEvent.click(screen.getByRole("button", { name: "Switch to Chinese" }));
      expect(document.documentElement.lang).toBe("zh-CN");
    });
  });

  describe("useLanguage hook", () => {
    it("should throw when used outside LanguageProvider", () => {
      const BadComponent = () => {
        useLanguage();
        return <div></div>;
      };

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<BadComponent />)).toThrow("useLanguage must be used within a LanguageProvider");
      consoleSpy.mockRestore();
    });
  });

  describe("Translation rendering", () => {
    it("should render ThemeToggle labels in zh-CN by default", () => {
      localStorage.setItem(LANG_KEY, "zh-CN");
      renderWithProviders(<ThemeToggle />);

      expect(screen.getByRole("radio", { name: "亮色模式" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "深色模式" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "高对比度模式" })).toBeInTheDocument();
    });

    it("should render ThemeToggle labels in English after language switch", () => {
      localStorage.setItem(LANG_KEY, "zh-CN");
      renderWithProviders(
        <>
          <LanguageSwitcher />
          <ThemeToggle />
        </>
      );

      // Switch to English
      fireEvent.click(screen.getByRole("button", { name: "切换到英文" }));

      expect(screen.getByRole("radio", { name: "Light mode" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Dark mode" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "High contrast mode" })).toBeInTheDocument();
    });
  });
});
