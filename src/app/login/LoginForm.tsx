"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./page.module.css";

/** Вход и регистрация — только через Google. Ошибку входа Better Auth передаёт в ?error=. */
export function LoginForm() {
  const error = useSearchParams().get("error");
  const [pending, setPending] = useState(false);

  async function signIn() {
    setPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/account",
      errorCallbackURL: "/login",
    });
    if (error) setPending(false);
  }

  return (
    <div className={styles.form}>
      <p className={styles.note}>Вход и регистрация — через аккаунт Google.</p>
      {error && (
        <p className={styles.error} role="alert">
          {error === "ACCOUNT_BLOCKED" ? "Аккаунт заблокирован." : "Не удалось войти. Попробуйте ещё раз."}
        </p>
      )}
      <button type="button" className="btn btn-primary btn-block btn-lg" onClick={signIn} disabled={pending}>
        Войти через Google
      </button>
    </div>
  );
}
