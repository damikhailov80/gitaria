"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { allLessons } from "@/lib/mock/course";
import { user } from "@/lib/mock/user";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import styles from "./Header.module.css";

const links = [
  { href: "/course", label: "Курс" },
  { href: "/materials", label: "Материалы" },
  { href: "/tools/tuner", label: "Тюнер" },
  { href: "/tools/metronome", label: "Метроном" },
];

/** Правая кнопка в шапке — в макете своя на каждом экране. */
export type HeaderAction = "trial" | "login" | "account" | "avatar";

export function Header({ action }: { action: HeaderAction }) {
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
        <HeaderActionButton action={action} />
      </nav>
    </header>
  );
}

function HeaderActionButton({ action }: { action: HeaderAction }) {
  switch (action) {
    case "trial":
      return (
        <Link href={`/course/${allLessons[0].slug}`} className={`btn btn-primary ${styles.action}`}>
          Пробный урок
        </Link>
      );
    case "login":
      return (
        <Link href="/login" className={`btn btn-secondary ${styles.action}`}>
          Войти
        </Link>
      );
    case "account":
      return (
        <Link href="/account" className={`btn btn-secondary ${styles.action}`}>
          Кабинет
        </Link>
      );
    case "avatar":
      return (
        <Link href="/account" className={styles.avatar} aria-label="Личный кабинет">
          {user.name[0]}
        </Link>
      );
  }
}
