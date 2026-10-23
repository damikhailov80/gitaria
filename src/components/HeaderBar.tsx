"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

const links = [
  { href: "/course", label: "Курс" },
  { href: "/materials", label: "Материалы" },
  { href: "/tools/tuner", label: "Тюнер" },
  { href: "/tools/metronome", label: "Метроном" },
];

/**
 * Site header (client part). `userName` — the signed-in user's name
 * (avatar), null — a guest («Войти»), undefined — the session is still loading.
 */
export function HeaderBar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={`container ${styles.header}`}>
      <Logo />
      <button
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls="site-nav"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ""}`}>
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${active ? styles.active : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        {/* Space for «Войти»/avatar is reserved up front so the menu doesn't jump while the session loads */}
        <div className={styles.actionSlot}>
          <span className={`btn btn-secondary ${styles.action} ${styles.sizer}`} aria-hidden="true">
            Войти
          </span>
          <HeaderAction userName={userName} />
        </div>
      </nav>
    </header>
  );
}

function HeaderAction({ userName }: { userName?: string | null }) {
  if (userName === undefined) return null;
  if (userName === null) {
    return (
      <Link href="/login" className={`btn btn-secondary ${styles.action}`}>
        Войти
      </Link>
    );
  }
  return (
    <Link href="/account" className={styles.avatar} aria-label="Личный кабинет">
      {userName[0]}
    </Link>
  );
}
