"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import styles from "./AccountShell.module.css";

export function AccountMenu({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  function item(href: string, label: string) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`${styles.menuItem} ${active ? styles.menuActive : ""}`}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  async function logout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className={styles.menu} aria-label="Разделы кабинета">
      {item("/account", "Мои курсы")}
      {item("/account/materials", "Мои материалы")}
      {item("/account/settings", "Настройки")}
      {isAdmin && item("/admin/users", "Пользователи")}
      <button type="button" className={`${styles.menuItem} ${styles.logout}`} onClick={logout}>
        Выйти
      </button>
    </nav>
  );
}
