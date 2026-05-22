import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./Navbar.module.css";

interface MobileLink {
  key: string;
  node: ReactNode;
}

interface NavbarProps {
  customMobileLinks?: (closeMenu: () => void) => MobileLink[];
  customMobileLinkLabel?: string;
}

const ExternalLinkIcon = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 4, verticalAlign: -1 }}>
    <path d="M6 2h8v8" />
    <path d="M14 2 4 12" />
  </svg>
);
const MOBILE_BREAKPOINT = 1200;

const Navbar = ({ customMobileLinks, customMobileLinkLabel }: NavbarProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const closeMenu = () => setIsOpen(false);

  const openMenu = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ?.focus();
    });
  };

  useEffect(() => {
    const main = document.querySelector<HTMLElement>('main');
    if (main) main.inert = isOpen;
    return () => { if (main) main.inert = false; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        hamburgerRef.current?.focus();
      }
    };
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const mobileLinks = customMobileLinks?.(closeMenu);

  return (
    <>
      <nav className={styles.navbar} aria-label={t("nav.ariaMainNav")}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <button
              ref={hamburgerRef}
              type="button"
              className={styles.hamburger}
              onClick={() => (isOpen ? closeMenu() : openMenu())}
              aria-label={isOpen ? t("nav.ariaCloseMenu") : t("nav.ariaOpenMenu")}
              aria-expanded={isOpen}
              aria-controls="nav-menu"
            >
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
            </button>
            <div className={styles.logo}><a href="/">TransCircle</a></div>
          </div>
          <ul ref={menuRef} id="nav-menu" className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
            <li><a href="/" onClick={closeMenu}>{t("nav.home")}</a></li>
            <li className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>{t("nav.links")}</span>
              <ul className={styles.dropdownMenu}>
                <li><a href="https://blog.transcircle.org/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{t("nav.blog")}<ExternalLinkIcon /></a></li>
                <li><a href="https://search.transcircle.org/" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{t("nav.search")}<ExternalLinkIcon /></a></li>
              </ul>
            </li>
            <li><a href="#stories" onClick={closeMenu}>{t("nav.stories")}</a></li>
            <li><a href="#archive" onClick={closeMenu}>{t("nav.archive")}</a></li>
            <li><a href="#community" onClick={closeMenu}>{t("nav.community")}</a></li>
            {mobileLinks && (
              <>
                <li className={styles.mobileDivider}></li>
                {customMobileLinkLabel && (
                  <li className={styles.mobileOnly}>
                    <span className={styles.mobileLinkLabel}>{customMobileLinkLabel}</span>
                  </li>
                )}
                <li className={styles.mobileOnly}>
                  <div className={styles.mobileTOCGroup}>
                    {mobileLinks.map(({ key, node }) => (
                      <div key={key} className={styles.mobileTOCItem}>{node}</div>
                    ))}
                  </div>
                </li>
              </>
            )}
            <li className={styles.mobileDivider}></li>
            <li className={`${styles.mobileOnly} ${styles.mobileThemeToggle}`}>
              <div className={styles.mobileThemeLabel}>{t("nav.language")}</div>
              <LanguageSwitcher className={styles.mobileThemeToggleGroup} />
            </li>
            <li className={`${styles.mobileOnly} ${styles.mobileThemeToggle}`}>
              <div className={styles.mobileThemeLabel}>{t("nav.theme")}</div>
              <ThemeToggle className={styles.mobileThemeToggleGroup} />
            </li>
          </ul>
          <div className={styles.rightSection}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayActive : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>
    </>
  );
};

export default Navbar;
