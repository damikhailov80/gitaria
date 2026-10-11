"use client";

import { useLayoutEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Lesson } from "@/lib/types";
import styles from "./page.module.css";

/** Видео урока: до клика — заглушка с кнопкой, после — плеер YouTube на её месте */
export function LessonVideo({ lesson }: { lesson: Lesson }) {
  const [playing, setPlaying] = useState(false);

  // При переходе на другую страницу Next.js не размонтирует её, а прячет (Activity),
  // и iframe продолжал бы играть — убираем плеер
  useLayoutEffect(() => () => setPlaying(false), []);

  return (
    <div className={styles.video}>
      {playing && lesson.youtubeId ? (
        <iframe
          className={styles.player}
          src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?autoplay=1&rel=0`}
          title={lesson.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          <span className={styles.videoBlob} aria-hidden="true" />
          <button
            type="button"
            className={styles.play}
            aria-label="Смотреть видео"
            disabled={!lesson.youtubeId}
            onClick={() => setPlaying(true)}
          >
            <Icon name="play" size={44} />
          </button>
          {lesson.durationLabel && <span className={styles.duration}>{lesson.durationLabel}</span>}
        </>
      )}
    </div>
  );
}
