import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./LessonRow.module.css";

type Props = {
  lesson: Lesson;
  /** compact — a row in the lesson sidebar, full — on the course page */
  variant?: "full" | "compact";
  active?: boolean;
  /** Lock on the lesson; by default — on all paid ones */
  locked?: boolean;
  /** Lesson completed — green number and a checkmark */
  completed?: boolean;
  /** The «Бесплатно» (Free) label (full only); by default — on free lessons */
  free?: boolean;
};

export function LessonRow({
  lesson,
  variant = "full",
  active = false,
  locked = !lesson.isFree,
  completed = false,
  free = lesson.isFree,
}: Props) {
  return (
    <Link
      href={`/course/${lesson.slug}`}
      className={`${styles.row} ${styles[variant]} ${active ? styles.active : ""} ${completed ? styles.completed : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <span className={styles.num}>{lesson.icon ? <Icon name={lesson.icon} size={16} /> : lesson.order}</span>
      <span className={styles.title}>{lesson.title}</span>
      {free && variant === "full" && <span className="tag tag-green">Бесплатно</span>}
      {completed && <Icon name="check" size={20} className={styles.check} aria-label="Урок пройден" />}
      {locked && <Icon name="lock" size={20} className={styles.lock} aria-label="Доступно после покупки" />}
    </Link>
  );
}
