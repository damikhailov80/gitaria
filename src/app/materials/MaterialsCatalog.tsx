"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { materials, materialTypeLabels } from "@/lib/mock/materials";
import type { MaterialType } from "@/lib/types";
import styles from "./page.module.css";

const filters: { value: MaterialType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Все" },
  { value: "VIDEO", label: "Видео" },
  { value: "SHEET_MUSIC", label: "Ноты" },
  { value: "LYRICS", label: "Тексты" },
];

const tagClass: Record<MaterialType, string> = {
  VIDEO: "tag tag-accent",
  SHEET_MUSIC: "tag tag-green",
  LYRICS: "tag",
};

export function MaterialsCatalog() {
  const [filter, setFilter] = useState<MaterialType | "ALL">("ALL");
  const visible = filter === "ALL" ? materials : materials.filter((m) => m.type === filter);

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Материалы</h1>
          <p className={styles.intro}>Бесплатные видео, ноты и тексты с аккордами. Скачивайте и играйте.</p>
        </div>
        <fieldset className="segmented">
          <legend className="sr-only">Тип материала</legend>
          {filters.map((f) => (
            <label key={f.value}>
              <input
                type="radio"
                name="material-type"
                value={f.value}
                checked={filter === f.value}
                onChange={() => setFilter(f.value)}
              />
              {f.label}
            </label>
          ))}
        </fieldset>
      </div>

      <ul className={styles.grid}>
        {visible.map((m) => (
          <li key={m.id} className={styles.card}>
            <div className={`${styles.thumb} ${styles[m.thumb]}`}>
              {m.type === "VIDEO" ? (
                <span className={styles.playCircle}>
                  <Icon name="play" size={30} />
                </span>
              ) : (
                <Icon name="doc" size={56} className={styles.docIcon} />
              )}
            </div>
            <div className={styles.cardBody}>
              <span className={tagClass[m.type]}>{materialTypeLabels[m.type]}</span>
              <h2 className={styles.cardTitle}>{m.title}</h2>
              <p className={styles.cardMeta}>{m.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
