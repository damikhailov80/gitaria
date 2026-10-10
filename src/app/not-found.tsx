import Link from "next/link";
import { Header } from "@/components/Header";
import { LogoMark } from "@/components/Logo";
import styles from "./not-found.module.css";

export const metadata = { title: "Страница не найдена — Gitaria" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        <div className={styles.card}>
          <span className={styles.circleTop} aria-hidden="true" />
          <span className={styles.circleBottom} aria-hidden="true" />
          <div className={styles.content}>
            <LogoMark size={96} />
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Страница не найдена</h1>
            <p className={styles.text}>Возможно, ссылка устарела или в адресе опечатка.</p>
            <Link href="/" className="btn btn-primary">
              На главную
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
