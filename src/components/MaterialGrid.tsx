"use client";

import Image from "next/image";
import { startTransition, useLayoutEffect, useOptimistic, useState } from "react";
import { setFavorite } from "@/app/materials/actions";
import { materialTypeLabels } from "@/lib/mock/materials";
import type { Material, MaterialType } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./MaterialGrid.module.css";
import { VideoDialog } from "./VideoDialog";

const tagClass: Record<MaterialType, string> = {
  VIDEO: "tag tag-accent",
  SHEET_MUSIC: "tag tag-green",
  IMAGE: "tag tag-neutral",
};

/**
 * Сетка карточек материалов. favoriteIds — избранное вошедшего пользователя;
 * без него кнопки избранного не показываются.
 */
export function MaterialGrid({
  materials,
  favoriteIds,
  className = "",
}: {
  materials: Material[];
  favoriteIds?: string[];
  className?: string;
}) {
  const [favorites, setOptimisticFavorite] = useOptimistic(
    favoriteIds,
    (ids, { id, favorite }: { id: string; favorite: boolean }) =>
      favorite ? [...(ids ?? []), id] : (ids ?? []).filter((x) => x !== id),
  );
  const [playing, setPlaying] = useState<Material | null>(null);

  // Страница при уходе прячется (Activity), а не размонтируется — закрываем видео, чтобы оно не играло
  useLayoutEffect(() => () => setPlaying(null), []);

  function toggleFavorite(id: string, favorite: boolean) {
    startTransition(async () => {
      setOptimisticFavorite({ id, favorite });
      await setFavorite(id, favorite);
    });
  }

  return (
    <>
      <ul className={`${styles.grid} ${className}`}>
        {materials.map((m, i) => (
          <li key={m.id} className={styles.card}>
            <div className={`${styles.thumb} ${m.thumb ? styles[m.thumb] : ""}`}>
              {m.cover && (
                <Image
                  src={m.cover}
                  alt=""
                  fill
                  // Обложки первого ряда видны сразу — грузим без lazy
                  loading={i < 3 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 400px"
                  className={styles.cover}
                />
              )}
              {m.type === "VIDEO" ? (
                <span className={styles.playCircle}>
                  <Icon name="play" size={30} />
                </span>
              ) : (
                !m.cover && <Icon name="doc" size={56} className={styles.docIcon} />
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardTop}>
                <span className={tagClass[m.type]}>{materialTypeLabels[m.type]}</span>
                {favorites && (
                  <FavoriteButton
                    active={favorites.includes(m.id)}
                    onChange={(favorite) => toggleFavorite(m.id, favorite)}
                  />
                )}
              </div>
              <h2 className={styles.cardTitle}>
                {/* Ссылка или кнопка растянута на всю карточку (::after), кнопка избранного — поверх */}
                {m.youtubeId ? (
                  <button type="button" className={styles.cardLink} onClick={() => setPlaying(m)}>
                    {m.title}
                  </button>
                ) : m.file ? (
                  <a href={m.file} target="_blank" rel="noopener" className={styles.cardLink}>
                    {m.title}
                  </a>
                ) : (
                  m.title
                )}
              </h2>
              <p className={styles.cardMeta}>{m.meta}</p>
            </div>
          </li>
        ))}
      </ul>
      <VideoDialog video={playing} onClose={() => setPlaying(null)} />
    </>
  );
}

function FavoriteButton({ active, onChange }: { active: boolean; onChange: (favorite: boolean) => void }) {
  return (
    <button
      type="button"
      className={styles.favorite}
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={() => onChange(!active)}
    >
      <Icon name="heart" size={22} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
