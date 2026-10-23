"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { Material } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./VideoDialog.module.css";

/** Modal with a YouTube player. The player is in the DOM only while the modal is open. */
export function VideoDialog({
  video,
  onClose,
}: {
  video: Pick<Material, "title" | "youtubeId"> | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (video) ref.current?.showModal();
    else ref.current?.close();
  }, [video]);

  // A page hidden on navigation (Activity) must not keep the modal open:
  // otherwise the visible page stops responding to clicks
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={video?.title}
      onClose={onClose}
      // Click on the backdrop around the modal
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
