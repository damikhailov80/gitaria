"use client";

import { useState } from "react";
import { MaterialGrid } from "@/components/MaterialGrid";
import { materials } from "@/lib/mock/materials";
import type { MaterialType } from "@/lib/types";
import styles from "./page.module.css";

const filters: { value: MaterialType | "ALL"; label: string }[] = [
  { value: "ALL", label: "Все" },
  { value: "VIDEO", label: "Видео" },
  { value: "SHEET_MUSIC", label: "Ноты" },
  { value: "IMAGE", label: "Изображения" },
];

const normalize = (s: string) => s.toLowerCase().replaceAll("ё", "е").trim();

/** favoriteIds — the signed-in user's favorites; without it the favorite buttons are not shown. */
export function MaterialsCatalog({ favoriteIds }: { favoriteIds?: string[] }) {
  const [filter, setFilter] = useState<MaterialType | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const q = normalize(query);
  const visible = materials.filter(
    (m) =>
      (filter === "ALL" || m.type === filter) &&
      (!q || normalize(`${m.title} ${m.author ?? ""}`).includes(q)),
  );

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Материалы</h1>
          <p className={styles.intro}>Бесплатные видео и ноты. Скачивайте и играйте.</p>
        </div>
        <div className={styles.controls}>
          <label className={styles.search}>
            <span className="sr-only">Поиск</span>
            <input
              type="search"
              className="input"
              placeholder="Поиск по названию или автору"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
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
      </div>

      {visible.length === 0 ? (
        <p className={styles.empty}>Ничего не найдено</p>
      ) : (
        <MaterialGrid materials={visible} favoriteIds={favoriteIds} className={styles.grid} />
      )}
    </>
  );
}
