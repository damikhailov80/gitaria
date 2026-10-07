import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { LessonRow } from "@/components/LessonRow";
import { allLessons, course, formatPrice, getLesson } from "@/lib/mock/course";
import styles from "./page.module.css";

export function generateStaticParams() {
  return allLessons.map((l) => ({ lessonSlug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/course/[lessonSlug]">): Promise<Metadata> {
  const { lessonSlug } = await params;
  const found = getLesson(lessonSlug);
  return { title: found ? `${found.lesson.title} — ${course.title}` : course.title };
}

export default function LessonPage({ params }: PageProps<"/course/[lessonSlug]">) {
  return (
    <>
      <Header action="account" />
      <Suspense>
        <LessonContent params={params} />
      </Suspense>
    </>
  );
}

async function LessonContent({ params }: { params: PageProps<"/course/[lessonSlug]">["params"] }) {
  const { lessonSlug } = await params;
  const found = getLesson(lessonSlug);
  if (!found) notFound();
  const { lesson, module: lessonModule } = found;

  const next = allLessons[lesson.order];
  const otherModules = course.modules.filter((m) => m.id !== lessonModule.id).map((m) => m.order);
  const otherCount = allLessons.length - lessonModule.lessons.length;
  const otherLabel =
    otherModules.length > 1 && otherModules.at(-1)! - otherModules[0] === otherModules.length - 1
      ? `${otherModules[0]}–${otherModules.at(-1)}`
      : otherModules.join(", ");
  const paidRange = allLessons.filter((l) => !l.isFree).map((l) => l.order);

  return (
    <main className={`container ${styles.layout}`}>
      <aside className={styles.sidebar}>
        <p className="eyebrow">
          Модуль {lessonModule.order} · {lessonModule.title}
        </p>
        <ol className={styles.sideList}>
          {lessonModule.lessons.map((l) => (
            <li key={l.id}>
              <LessonRow lesson={l} variant="compact" active={l.id === lesson.id} />
            </li>
          ))}
        </ol>
        <Link href="/course" className={styles.more}>
          + ещё {otherCount} уроков в модулях {otherLabel}
        </Link>
      </aside>

      <article className={styles.main}>
        <div className={styles.video}>
          <span className={styles.videoBlob} aria-hidden="true" />
          <button type="button" className={styles.play} aria-label="Смотреть видео">
            <Icon name="play" size={44} />
          </button>
          {lesson.durationLabel && <span className={styles.duration}>{lesson.durationLabel}</span>}
        </div>

        <div className={styles.meta}>
          {lesson.isFree && <span className="tag tag-green">Бесплатный урок</span>}
          <span className={styles.counter}>
            Урок {lesson.order} из {allLessons.length}
          </span>
        </div>
        <h1 className={styles.title}>{lesson.title}</h1>

        <div className={styles.body}>
          <div className={styles.text}>
            {lesson.content?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {lesson.homework && (
              <>
                <h2 className={styles.subtitle}>Что сделать после урока</h2>
                <p>{lesson.homework}</p>
              </>
            )}
          </div>

          {lesson.attachments && lesson.attachments.length > 0 && (
            <aside className={styles.materials}>
              <p className="eyebrow">Материалы</p>
              <ul>
                {lesson.attachments.map((a) => (
                  <li key={a.id}>
                    <a href={a.href} className={styles.attachment}>
                      <Icon name="doc" size={28} className={styles.docIcon} />
                      <span className={styles.attachmentText}>
                        <span className={styles.attachmentTitle}>{a.title}</span>
                        <span className={styles.attachmentMeta}>{a.meta}</span>
                      </span>
                      <Icon name="download" size={22} />
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        {next && (
          <div className={styles.next}>
            <div>
              <h2 className={styles.nextTitle}>Следующий: «{next.title}»</h2>
              <p className={styles.nextNote}>
                Уроки {paidRange[0]}–{paidRange.at(-1)} откроются после покупки курса
              </p>
            </div>
            <Link href="/checkout" className="btn btn-primary">
              Открыть курс · {formatPrice(course.priceAmount)}
            </Link>
          </div>
        )}
      </article>
    </main>
  );
}
