import Link from "next/link";
import { LessonRow } from "@/components/LessonRow";
import { allLessons, course } from "@/lib/mock/course";
import type { Lesson, Module } from "@/lib/types";
import styles from "./page.module.css";

/** Левая панель урока: вступление + модуль текущего урока (для вступления — первый модуль) */
export function LessonSidebar({ lesson, lessonModule }: { lesson: Lesson; lessonModule: Module | null }) {
  const sideModule = lessonModule ?? course.modules[0];
  const otherModules = course.modules.filter((m) => m.id !== sideModule.id).map((m) => m.order);
  const otherCount = allLessons.length - sideModule.lessons.length;
  const otherLabel =
    otherModules.length > 1 && otherModules.at(-1)! - otherModules[0] === otherModules.length - 1
      ? `${otherModules[0]}–${otherModules.at(-1)}`
      : otherModules.join(", ");

  return (
    <aside className={styles.sidebar}>
      {course.intro && (
        <>
          <p className="eyebrow">Вступление</p>
          <ol className={styles.sideList}>
            <li>
              <LessonRow lesson={course.intro} variant="compact" active={course.intro.id === lesson.id} />
            </li>
          </ol>
        </>
      )}
      <p className="eyebrow">
        Модуль {sideModule.order} · {sideModule.title}
      </p>
      <ol className={styles.sideList}>
        {sideModule.lessons.map((l) => (
          <li key={l.id}>
            <LessonRow lesson={l} variant="compact" active={l.id === lesson.id} />
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
