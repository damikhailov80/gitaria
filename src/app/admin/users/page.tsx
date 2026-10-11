import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { setBlocked, setSubscription } from "./actions";
import styles from "./page.module.css";

export const metadata = { title: "Пользователи — Gitaria" };

const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });

// Данные пользователя читаются из сессии — только внутри <Suspense>.
export default function UsersPage() {
  return (
    <Suspense>
      <UsersTable />
    </Suspense>
  );
}

async function UsersTable() {
  const admin = await requireAdmin();
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h1 className={styles.title}>Пользователи</h1>
      <p className={styles.count}>Всего: {users.length}</p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Роль</th>
            <th>Регистрация</th>
            <th>Подписка</th>
            <th>Статус</th>
            <th>
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <span className={styles.name}>{u.name}</span>
                <span className={styles.email}>{u.email}</span>
              </td>
              <td data-label="Роль">{u.role === "ADMIN" ? "Админ" : "Пользователь"}</td>
              <td data-label="Регистрация" className={styles.date}>{dateFormat.format(u.createdAt)}</td>
              <td data-label="Подписка">
                {u.hasSubscription ? <span className="tag tag-green">Есть</span> : <span className="tag">Нет</span>}
              </td>
              <td data-label="Статус">
                {u.isBlocked ? (
                  <span className="tag tag-accent">Заблокирован</span>
                ) : u.deletedAt ? (
                  <span className="tag">Удалён</span>
                ) : (
                  "Активен"
                )}
              </td>
              <td>
                {(u.role === "USER" || u.id === admin.id) && (
                  <div className={styles.actions}>
                    <form action={setSubscription.bind(null, u.id, !u.hasSubscription)}>
                      <button type="submit" className={`btn btn-secondary ${styles.action}`}>
                        {u.hasSubscription ? "Снять подписку" : "Дать подписку"}
                      </button>
                    </form>
                    {u.role === "USER" && (
                      <form action={setBlocked.bind(null, u.id, !u.isBlocked)}>
                        <button type="submit" className={`btn btn-secondary ${styles.action}`}>
                          {u.isBlocked ? "Разблокировать" : "Заблокировать"}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
