import Link from "next/link";
import { LessonRow } from "@/components/LessonRow";
import { allLessons, course } from "@/lib/mock/course";
import type { Lesson, Module } from "@/lib/types";
import styles from "./page.module.css";

/** Lesson sidebar: introduction + the current lesson's module (for the introduction — the first module) */
export function LessonSidebar({
  lesson,
  lessonModule,
  subscribed,
  completed,
}: {
  lesson: Lesson;
  lessonModule: Module | null;
  /** With a subscription paid lessons have no locks */
  subscribed: boolean;
  /** ids of completed lessons */
  completed: Set<string>;
}) {
  const sideModule = lessonModule ?? course.modules[0];
  const otherModules = course.modules.filter((m) => m.id !== sideModule.id).map((m) => m.order);
  const otherCount = allLessons.length - sideModule.lessons.length;
  const otherLabel =
    otherModules.length > 1 && otherModules.at(-1)! - otherModules[0] === otherModules.length - 1
      ? `${otherModules[0]}–${otherModules.at(-1)}`
      : otherModules.join(", ");

  return (
    <aside className={styles.sidebar}>
      {course.intro.length > 0 && (
        <>
          <p className="eyebrow">Вступление</p>
          <ol className={styles.sideList}>
            {course.intro.map((l) => (
              <li key={l.id}>
                <LessonRow lesson={l} variant="compact" active={l.id === lesson.id} locked={!l.isFree && !subscribed} />
              </li>
            ))}
          </ol>
        </>
      )}
      <p className="eyebrow">
        Модуль {sideModule.order} · {sideModule.title}
      </p>
      <ol className={styles.sideList}>
        {sideModule.lessons.map((l) => (
          <li key={l.id}>
            <LessonRow
              lesson={l}
              variant="compact"
              active={l.id === lesson.id}
              locked={!l.isFree && !subscribed}
              completed={completed.has(l.id)}
            />
          </li>
        ))}
      </ol>
      {otherCount > 0 && (
        <Link href="/course" className={styles.more}>
          + ещё {otherCount} уроков в {otherModules.length > 1 ? "модулях" : "модуле"} {otherLabel}
        </Link>
      )}
    </aside>
  );
}
