import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { allLessons, course } from "@/lib/mock/course";
import { enrollment, recentMaterials } from "@/lib/mock/user";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export const metadata = { title: "Личный кабинет — Gitaria" };

// Данные пользователя читаются из сессии — только внутри <Suspense>.
export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();
  const current = allLessons.find((l) => l.slug === enrollment.currentLessonSlug)!;
  const progress = (enrollment.completedLessons / allLessons.length) * 100;

  return (
    <>
      <h1 className={styles.title}>Здравствуйте, {user.name}</h1>
      <p className={styles.subscription}>
        {user.hasSubscription ? (
          <span className="tag tag-green">Подписка активна</span>
        ) : (
          <>
            <span className="tag">Подписка не куплена</span>
            <Link href="/checkout">Купить курс</Link>
          </>
        )}
      </p>

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
    </>
  );
}
