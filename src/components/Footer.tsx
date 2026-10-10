import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <span>© 2026 Gitaria · Гданьск</span>
      <Link href="/privacy" className={styles.link}>
        Политика конфиденциальности
      </Link>
      <span>gitaria.pl</span>
    </footer>
  );
}
