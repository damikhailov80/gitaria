"use client";

import { useState } from "react";
import { deleteAccount } from "./actions";
import styles from "./page.module.css";

export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" className="btn btn-secondary" onClick={() => setConfirming(true)}>
        Удалить аккаунт
      </button>
    );
  }

  return (
    <form action={deleteAccount} className={styles.confirm}>
      <p className={styles.confirmText}>Точно удалить аккаунт?</p>
      <div className={styles.confirmButtons}>
        <button type="submit" className="btn btn-primary">
          Да, удалить
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
          Отмена
        </button>
      </div>
    </form>
  );
}
