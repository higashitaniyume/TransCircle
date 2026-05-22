import { useTranslation } from "react-i18next";
import styles from "./LicenseFooter.module.css";

function LicenseFooter() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.divider}></div>
      <div className={styles.content}>
        <h2 className={styles.heading}>{t("footer.heading")}</h2>
        <p>{t("footer.licenseText1")}</p>
        <p>{t("footer.licenseText2")}</p>
      </div>
    </footer>
  );
}

export default LicenseFooter;
