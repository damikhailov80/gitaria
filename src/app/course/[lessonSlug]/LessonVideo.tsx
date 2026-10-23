"use client";

import { useLayoutEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import type { Lesson } from "@/lib/types";
import styles from "./page.module.css";

/** Lesson video: before the click — a placeholder with a button, after — the YouTube player in its place */
export function LessonVideo({ lesson }: { lesson: Lesson }) {
  const [playing, setPlaying] = useState(false);

  // When navigating to another page, Next.js doesn't unmount this one but hides it (Activity),
  // and the iframe would keep playing — remove the player
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
