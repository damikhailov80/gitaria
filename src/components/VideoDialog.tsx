"use client";

import { useEffect, useRef } from "react";
import type { Material } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./VideoDialog.module.css";

/** Модальное окно с плеером YouTube. Плеер есть в DOM, только пока окно открыто. */
export function VideoDialog({ video, onClose }: { video: Material | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (video) ref.current?.showModal();
    else ref.current?.close();
  }, [video]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={video?.title}
      onClose={onClose}
      // Клик по фону вокруг окна
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {video && (
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title}>{video.title}</h2>
            <button type="button" className={styles.close} aria-label="Закрыть" onClick={onClose}>
              <Icon name="close" size={24} />
            </button>
          </div>
          <div className={styles.player}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
