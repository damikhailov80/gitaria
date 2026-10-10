import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { DeleteAccount } from "./DeleteAccount";
import styles from "./page.module.css";

export const metadata = { title: "Настройки — Gitaria" };

// Данные пользователя читаются из сессии — только внутри <Suspense>.
export default function SettingsPage() {
  return (
    <Suspense>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const user = await getCurrentUser();

  return (
    <>
      <h1 className={styles.title}>Настройки</h1>

      <section className={styles.card}>
        <p className="eyebrow">Профиль</p>
        <dl className={styles.fields}>
          <div>
            <dt>Имя</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt>Электронная почта</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
        <p className={styles.note}>Имя и почта берутся из аккаунта Google.</p>
      </section>

      <section className={styles.card}>
        <p className="eyebrow">Удаление аккаунта</p>
        <p className={styles.text}>
          Вы выйдете из кабинета. Если снова войдёте через Google, аккаунт восстановится вместе с подпиской.
        </p>
        <DeleteAccount />
      </section>
    </>
  );
}
