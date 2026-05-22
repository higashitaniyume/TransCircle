import { useTranslation } from "react-i18next";
import styles from './FloatingTOC.module.css';

export interface TOCItem {
  href: string;
  label: string;
}

interface FloatingTOCProps {
  items: TOCItem[];
  label?: string;
}

const FloatingTOC = ({ items, label }: FloatingTOCProps) => {
  const { t } = useTranslation();
  const displayLabel = label ?? t('toc.defaultLabel');
  return (
    <nav className={styles.toc} aria-label={displayLabel}>
      <span className={styles.heading} aria-hidden="true">{displayLabel}</span>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.link}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FloatingTOC;
