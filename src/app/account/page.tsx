import Link from "next/link";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { allLessons, course } from "@/lib/mock/course";
import { enrollment, recentMaterials, user } from "@/lib/mock/user";
import styles from "./page.module.css";

export const metadata = { title: "Личный кабинет — Gitaria" };

// Разделы кроме «Мои курсы» в макете не нарисованы — пока заглушки.
const menu = ["Мои материалы", "Покупки", "Настройки"];

export default function AccountPage() {
  const current = allLessons.find((l) => l.slug === enrollment.currentLessonSlug)!;
  const progress = (enrollment.completedLessons / allLessons.length) * 100;

  return (
    <>
      <Header action="avatar" />
      <main className={`container ${styles.layout}`}>
        <nav className={styles.menu} aria-label="Разделы кабинета">
          <Link href="/account" className={`${styles.menuItem} ${styles.menuActive}`} aria-current="page">
            Мои курсы
          </Link>
          {menu.map((item) => (
            <button key={item} type="button" className={styles.menuItem}>
              {item}
            </button>
          ))}
          <button type="button" className={`${styles.menuItem} ${styles.logout}`}>
            Выйти
          </button>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>Здравствуйте, {user.name}</h1>

          <section className={styles.continue}>
            <div className={styles.continueText}>
              <p className={`eyebrow ${styles.greenEyebrow}`}>Продолжить</p>
              <h2 className={styles.continueTitle}>
                Урок {current.order} · {current.title}
              </h2>
              <div
                className={styles.progress}
                role="progressbar"
                aria-valuenow={enrollment.completedLessons}
                aria-valuemin={0}
                aria-valuemax={allLessons.length}
                aria-label="Прогресс курса"
              >
                <span style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.progressText}>
                Пройдено {enrollment.completedLessons} из {allLessons.length} уроков
              </p>
            </div>
            <Link href={`/course/${current.slug}`} className="btn btn-primary btn-lg">
              Продолжить урок
            </Link>
          </section>

          <div className={styles.cards}>
            <section className={styles.card}>
              <p className="eyebrow">Мой курс</p>
              <h2 className={styles.cardTitle}>{course.title}</h2>
              <p className={styles.cardText}>Куплен {enrollment.purchasedAt} · доступ навсегда</p>
              <Link href="/course" className={styles.cardLink}>
                Программа курса <Icon name="arrowRight" size={20} />
              </Link>
            </section>

            <section className={styles.card}>
              <p className="eyebrow">Последние материалы</p>
              <ul className={styles.files}>
                {recentMaterials.map((m) => (
                  <li key={m.id}>
                    <a href={m.href}>
                      <span>{m.title}</span>
                      <span className={styles.fileKind}>{m.kind}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
