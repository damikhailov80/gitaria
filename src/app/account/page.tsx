import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { allLessons, course, formatPrice } from "@/lib/mock/course";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export const metadata = { title: "Личный кабинет — Gitaria" };

// User data is read from the session — only inside <Suspense>.
export default function AccountPage() {
  return (
    <Suspense>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();
  const rows = await db.lessonProgress.findMany({ where: { userId: user.id }, select: { lessonId: true } });
  const done = new Set(rows.map((r) => r.lessonId));
  const completed = allLessons.filter((l) => done.has(l.id)).length;
  // Next is the first uncompleted lesson; if it's paid and there's no subscription — offer to buy the course
  const next = allLessons.find((l) => !done.has(l.id));
  const locked = next && !next.isFree && !user.hasSubscription;

  return (
    <>
      <h1 className={styles.title}>Здравствуйте, {user.name}</h1>

      <section className={styles.continue}>
        <div className={styles.continueText}>
          <p className={`eyebrow ${styles.greenEyebrow}`}>
            {!next ? "Курс пройден" : locked ? "Дальше — после покупки курса" : completed ? "Продолжить" : "Начать курс"}
          </p>
          <h2 className={styles.continueTitle}>{next ? `Урок ${next.order} · ${next.title}` : course.title}</h2>
          {completed > 0 && (
            <>
              <div
                className={styles.progress}
                role="progressbar"
                aria-valuenow={completed}
                aria-valuemin={0}
                aria-valuemax={allLessons.length}
                aria-label="Прогресс курса"
              >
                <span style={{ width: `${(completed / allLessons.length) * 100}%` }} />
              </div>
              <p className={styles.progressText}>
                Пройдено {completed} из {allLessons.length} уроков
              </p>
            </>
          )}
        </div>
        {!next ? (
          <Link href="/course" className="btn btn-primary btn-lg">
            Программа курса
          </Link>
        ) : locked ? (
          <Link href="/checkout" className="btn btn-primary btn-lg">
            Открыть курс · {formatPrice(course.priceAmount)}
          </Link>
        ) : (
          <Link href={`/course/${next.slug}`} className="btn btn-primary btn-lg">
            {completed ? "Продолжить урок" : "Начать урок"}
          </Link>
        )}
      </section>
    </>
  );
}
