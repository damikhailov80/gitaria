import Link from "next/link";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { LessonRow } from "@/components/LessonRow";
import { allLessons, course, formatPrice } from "@/lib/mock/course";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import styles from "./page.module.css";

export const metadata = { title: `${course.title} — курс Gitaria` };

export default function CoursePage() {
  return (
    <>
      <Header />
      <main className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.description}>{course.description}</p>
          <ul className={styles.highlights}>
            {course.highlights.map((h) => (
              <li key={h} className="tag">
                {h}
              </li>
            ))}
          </ul>

          {/* Замки зависят от подписки — список показываем только после загрузки сессии, чтобы они не мигали */}
          <Suspense fallback={null}>
            <SessionModuleList />
          </Suspense>
        </div>

        {/* Купившему курс не предлагаем его купить — карточку не показываем и до загрузки сессии */}
        <Suspense fallback={null}>
          <SessionPriceCard />
        </Suspense>
      </main>
    </>
  );
}

async function SessionPriceCard() {
  const user = await getSessionUser();
  return user?.hasSubscription ? null : <PriceCard />;
}

function PriceCard() {
  return (
    <aside className={styles.priceCard}>
      <p className={styles.price}>{formatPrice(course.priceAmount)}</p>
      <p className={styles.priceNote}>Разовая оплата. Все {allLessons.length} уроков и материалы — навсегда в вашем кабинете.</p>
      <Link href="/checkout" className="btn btn-primary btn-block">
        Купить курс
      </Link>
      <Link href={`/course/${allLessons[0].slug}`} className="btn btn-secondary btn-block">
        Сначала бесплатный урок
      </Link>
      <ul className={styles.notes}>
        <li>
          <Icon name="check" size={18} />
          Безопасная оплата картой через Stripe
        </li>
        <li>
          <Icon name="check" size={18} />
          BLIK и Przelewy24
        </li>
      </ul>
    </aside>
  );
}

async function SessionModuleList() {
  const user = await getSessionUser();
  const subscribed = !!user?.hasSubscription;
  // Пройденные уроки отмечаем только у тех, кто купил курс
  const rows = subscribed
    ? await db.lessonProgress.findMany({ where: { userId: user.id }, select: { lessonId: true } })
    : [];
  return <ModuleList subscribed={subscribed} completed={new Set(rows.map((r) => r.lessonId))} />;
}

/** Вступление и модули курса; с подпиской нет замков у платных уроков и метки «Бесплатно» */
function ModuleList({ subscribed, completed }: { subscribed: boolean; completed: Set<string> }) {
  return (
    <>
      {course.intro.length > 0 && (
        <section className={styles.module}>
          <h2 className={styles.moduleHeading}>
            <span className="eyebrow">Вступление</span>
          </h2>
          <ol className={styles.lessons}>
            {course.intro.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow lesson={lesson} locked={!lesson.isFree && !subscribed} free={lesson.isFree && !subscribed} />
              </li>
            ))}
          </ol>
        </section>
      )}
      {course.modules.map((m) => (
        <section key={m.id} className={styles.module}>
          <h2 className={styles.moduleHeading}>
            <span className="eyebrow">Модуль {m.order}</span>
            <span className={styles.moduleTitle}>{m.title}</span>
          </h2>
          <ol className={styles.lessons}>
            {m.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow
                  lesson={lesson}
                  locked={!lesson.isFree && !subscribed}
                  free={lesson.isFree && !subscribed}
                  completed={completed.has(lesson.id)}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
