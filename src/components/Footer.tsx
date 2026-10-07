import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <span>© 2026 Gitaria · Гданьск</span>
      <span>gitaria.pl</span>
    </footer>
  );
}
