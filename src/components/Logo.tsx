import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

/** Знак Gitaria: сердце с гитарой и нотами (public/logo-mark.svg). */
export function LogoMark({ size = 48 }: { size?: number }) {
  return (
    <Image
      src="/logo-mark.svg"
      alt=""
      width={size}
      height={Math.round((size * 417) / 467)}
      preload
    />
  );
}

export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Gitaria — на главную">
      <LogoMark />
      <Image
        src="/logo-wordmark.svg"
        alt=""
        width={113}
        height={22}
        className={styles.wordmark}
        preload
      />
    </Link>
  );
}
