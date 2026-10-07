import Link from "next/link";
import styles from "./Logo.module.css";

/** Медиатор с буквой G — знак Gitaria. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 44) / 40} viewBox="0 0 40 44" aria-hidden="true">
      <path d="M20 43C14 43 2 24 2 13 2 5 10 1 20 1s18 4 18 12c0 11-12 30-18 30Z" fill="var(--color-accent)" />
      <path
        d="M25.7 11.3A8 8 0 1 0 28 17h-7"
        fill="none"
        stroke="var(--color-neutral-200)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="34" r="2.8" fill="var(--color-accent-2-300)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Gitaria — на главную">
      <LogoMark />
      <span>Gitaria</span>
    </Link>
  );
}
