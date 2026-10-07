"use client";

import { useState } from "react";
import styles from "./page.module.css";

/** Форма по макету. Авторизация пока не подключена — кнопки ничего не делают. */
export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <fieldset className="segmented">
        <legend className="sr-only">Режим</legend>
        <label>
          <input type="radio" name="mode" checked={mode === "login"} onChange={() => setMode("login")} />
          Вход
        </label>
        <label>
          <input type="radio" name="mode" checked={mode === "register"} onChange={() => setMode("register")} />
          Регистрация
        </label>
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor="email">
          Электронная почта
        </label>
        <input id="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="••••••••"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block btn-lg">
        {mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>
      <button type="button" className="btn btn-secondary btn-block btn-lg">
        Войти через Google
      </button>
      {mode === "login" && (
        <a href="#" className={styles.forgot}>
          Забыли пароль?
        </a>
      )}
    </form>
  );
}
