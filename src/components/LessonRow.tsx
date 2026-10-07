import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./LessonRow.module.css";

type Props = {
  lesson: Lesson;
  /** compact — строка в сайдбаре урока, full — на странице курса */
  variant?: "full" | "compact";
  active?: boolean;
};

export function LessonRow({ lesson, variant = "full", active = false }: Props) {
  return (
    <Link
      href={`/course/${lesson.slug}`}
      className={`${styles.row} ${styles[variant]} ${active ? styles.active : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className={styles.num}>{lesson.order}</span>
      <span className={styles.title}>{lesson.title}</span>
      {lesson.isFree ? (
        variant === "full" && <span className="tag tag-green">Бесплатно</span>
      ) : (
        <Icon name="lock" size={20} className={styles.lock} aria-label="Доступно после покупки" />
      )}
    </Link>
  );
}
