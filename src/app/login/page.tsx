import { Logo, LogoMark } from "@/components/Logo";
import { LoginForm } from "./LoginForm";
import styles from "./page.module.css";

export const metadata = { title: "Вход в кабинет — Gitaria" };

export default function LoginPage() {
  return (
    <main className={styles.split}>
      <section className={styles.formSide}>
        <Logo />
        <h1 className={styles.title}>Вход в кабинет</h1>
        <LoginForm />
      </section>
      <section className={styles.art} aria-hidden="true">
        <span className={styles.circleTop} />
        <span className={styles.circleBottom} />
        <div className={styles.artContent}>
          <LogoMark size={220} />
          <p className={styles.artText}>Ваши уроки ждут в кабинете</p>
        </div>
      </section>
    </main>
  );
}
