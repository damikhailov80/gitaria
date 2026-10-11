import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { allLessons, course, formatPrice, getLesson } from "@/lib/mock/course";
import { getSessionUser } from "@/lib/session";
import { LessonSidebar } from "./LessonSidebar";
import { LessonVideo } from "./LessonVideo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return [...(course.intro ? [course.intro] : []), ...allLessons].map((l) => ({ lessonSlug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/course/[lessonSlug]">): Promise<Metadata> {
  const { lessonSlug } = await params;
  const found = getLesson(lessonSlug);
  return { title: found ? `${found.lesson.title} — ${course.title}` : course.title };
}

export default function LessonPage({ params }: PageProps<"/course/[lessonSlug]">) {
  return (
    <>
      <Header />
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

  // Платные уроки — только с подпиской; без неё видео, текст и PDF на страницу не попадают
  const user = await getSessionUser();
  const subscribed = !!user?.hasSubscription;
  const hasAccess = lesson.isFree || subscribed;

  const next = allLessons[lesson.order];
  const paidRange = allLessons.filter((l) => !l.isFree).map((l) => l.order);

  return (
    <main className={`container ${styles.layout}`}>
      <LessonSidebar lesson={lesson} lessonModule={lessonModule} subscribed={subscribed} />

      <article className={styles.main}>
        {hasAccess ? (
          <LessonVideo lesson={lesson} />
        ) : (
          <div className={styles.video}>
            <span className={styles.videoBlob} aria-hidden="true" />
            <span className={styles.videoLock}>
              <Icon name="lock" size={40} aria-label="Доступно после покупки" />
            </span>
          </div>
        )}

        <div className={styles.meta}>
          {lesson.isFree && <span className="tag tag-green">Бесплатный урок</span>}
          <span className={styles.counter}>
            {lessonModule ? `Урок ${lesson.order} из ${allLessons.length}` : "Вступление"}
          </span>
        </div>
        <h1 className={styles.title}>{lesson.title}</h1>

        {!hasAccess && (
          <div className={styles.next}>
            <div>
              <h2 className={styles.nextTitle}>Урок откроется после покупки курса</h2>
              <p className={styles.nextNote}>
                Уроки {paidRange[0]}–{paidRange.at(-1)} доступны ученикам с подпиской
              </p>
            </div>
            {user ? (
              <Link href="/checkout" className="btn btn-primary">
                Открыть курс · {formatPrice(course.priceAmount)}
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary">
                Войти
              </Link>
            )}
          </div>
        )}

        {hasAccess && (
          <div className={`${styles.body} ${lesson.attachments?.length ? "" : styles.bodySingle}`}>
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
        )}

        {hasAccess && next && (next.isFree || subscribed) && (
          <div className={styles.next}>
            <h2 className={styles.nextTitle}>Следующий: «{next.title}»</h2>
            <Link href={`/course/${next.slug}`} className="btn btn-primary">
              Смотреть урок {next.order}
            </Link>
          </div>
        )}

        {hasAccess && next && !next.isFree && !subscribed && (
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
