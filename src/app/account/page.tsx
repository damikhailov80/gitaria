import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { db } from "@/lib/db";
import { allLessons, course } from "@/lib/mock/course";
import { materials } from "@/lib/mock/materials";
import { enrollment } from "@/lib/mock/user";
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
  const favoriteRows = await db.favoriteMaterial.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { materialId: true },
  });
  // Материал могли убрать из списка — такие записи просто не показываем
  const favorites = favoriteRows.flatMap((f) => materials.find((m) => m.id === f.materialId) ?? []);

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
          <p className="eyebrow">Избранное</p>
          {favorites.length ? (
            <ul className={styles.files}>
              {favorites.map((m) => (
                <li key={m.id}>
                  <a href={m.file ?? "/materials"} {...(m.file && { target: "_blank", rel: "noopener" })}>
                    <span>{m.title}</span>
                    <span className={styles.fileKind}>{m.type === "VIDEO" ? "Видео" : "PDF"}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className={styles.cardText}>Отмечайте материалы сердечком — они появятся здесь.</p>
              <Link href="/materials" className={styles.cardLink}>
                Все материалы <Icon name="arrowRight" size={20} />
              </Link>
            </>
          )}
        </section>
      </div>
    </>
  );
}
