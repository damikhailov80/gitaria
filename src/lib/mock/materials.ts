import type { Material } from "@/lib/types";
import sheetMusic from "./materials.json";

const videos: Material[] = [
  { id: "m1", slug: "kak-derzhat-mediator", type: "VIDEO", title: "Как держать медиатор", meta: "YouTube · 6 мин", thumb: "peach" },
  { id: "m4", slug: "nastroyka-po-tyuneru", type: "VIDEO", title: "Настройка гитары по тюнеру", meta: "YouTube · 4 мин", thumb: "peach-light" },
];

export const materials: Material[] = [
  ...sheetMusic.map((m): Material => ({ ...m, type: "SHEET_MUSIC", meta: `${m.author} · ${m.pages} стр.` })),
  ...videos,
];

export const materialTypeLabels: Record<Material["type"], string> = {
  VIDEO: "Видео",
  SHEET_MUSIC: "Ноты PDF",
};
