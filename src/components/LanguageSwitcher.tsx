import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher = ({ className = "" }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggle = () => {
    setLanguage(language === "zh-CN" ? "en" : "zh-CN");
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${className}`.trim()}
      onClick={toggle}
      aria-label={t("lang.label")}
    >
      {t("lang.switchTo")}
    </button>
  );
};

export default LanguageSwitcher;
