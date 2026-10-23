import type { Material, MaterialType } from "@/lib/types";
import data from "./materials.json";

/** A materials.json entry: sheet music — PDFs from public/materials, images — from there too, videos — YouTube only */
type MaterialEntry = {
  id: string;
  slug: string;
  type: MaterialType;
  title: string;
  author: string;
  /** Sheet music */
  pages?: number;
  file?: string;
  cover?: string;
  /** Video */
  minutes?: number;
  youtubeId?: string;
};

export const materials: Material[] = (data as MaterialEntry[]).map(({ pages, minutes, ...m }) =>
  m.youtubeId
    ? { ...m, meta: `${m.author} · ${minutes} мин`, cover: `https://i.ytimg.com/vi/${m.youtubeId}/maxresdefault.jpg` }
    : m.type === "IMAGE"
      ? { ...m, meta: m.author, cover: m.file }
      : { ...m, meta: `${m.author} · ${pages} стр.` },
);

export const materialTypeLabels: Record<Material["type"], string> = {
  VIDEO: "Видео",
  SHEET_MUSIC: "Ноты PDF",
  IMAGE: "Изображение",
};
