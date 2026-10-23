"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { VideoDialog } from "@/components/VideoDialog";
import type { Attachment } from "@/lib/types";
import styles from "./page.module.css";

/** Lesson materials: files open in a new tab, videos — in a modal */
export function LessonAttachments({ attachments }: { attachments: Attachment[] }) {
  const [playing, setPlaying] = useState<Extract<Attachment, { kind: "video" }> | null>(null);

  return (
    <>
      <ul>
        {attachments.map((a) => {
          const text = (
            <span className={styles.attachmentText}>
              <span className={styles.attachmentTitle}>{a.title}</span>
              <span className={styles.attachmentMeta}>{a.meta}</span>
            </span>
          );
          return (
            <li key={a.id}>
              {a.kind === "video" ? (
                <button type="button" className={styles.attachment} onClick={() => setPlaying(a)}>
                  <Icon name="play" size={28} className={styles.docIcon} />
                  {text}
                </button>
              ) : (
                <a href={a.href} className={styles.attachment} target="_blank" rel="noopener">
                  <Icon name={a.kind === "image" ? "image" : "doc"} size={28} className={styles.docIcon} />
                  {text}
                  <Icon name="download" size={22} />
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <VideoDialog video={playing} onClose={() => setPlaying(null)} />
    </>
  );
}
