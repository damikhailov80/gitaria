import Link from "next/link";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { LessonRow } from "@/components/LessonRow";
import { allLessons, course, formatPrice } from "@/lib/mock/course";
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

          {course.modules.map((m) => (
            <section key={m.id} className={styles.module}>
              <h2 className={styles.moduleHeading}>
                <span className="eyebrow">Модуль {m.order}</span>
                <span className={styles.moduleTitle}>{m.title}</span>
              </h2>
              <ol className={styles.lessons}>
                {m.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <LessonRow lesson={lesson} />
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <aside className={styles.priceCard}>
          <p className={styles.price}>{formatPrice(course.priceAmount)}</p>
          <p className={styles.priceNote}>Разовая оплата. Все 24 урока и материалы — навсегда в вашем кабинете.</p>
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
      </main>
    </>
  );
}
