import type { Material } from "@/lib/types";

export const materials: Material[] = [
  { id: "m1", slug: "kak-derzhat-mediator", type: "VIDEO", title: "Как держать медиатор", meta: "YouTube · 6 мин", thumb: "peach" },
  { id: "m2", slug: "etyud-lya-minor", type: "SHEET_MUSIC", title: "Этюд ля минор для начинающих", meta: "2 страницы", thumb: "green" },
  { id: "m3", slug: "pesnya-u-kostra", type: "LYRICS", title: "Песня у костра: аккорды и бой", meta: "Am · Dm · E · G", thumb: "neutral" },
  { id: "m4", slug: "nastroyka-po-tyuneru", type: "VIDEO", title: "Настройка гитары по тюнеру", meta: "YouTube · 4 мин", thumb: "peach-light" },
  { id: "m5", slug: "tablica-akkordov", type: "SHEET_MUSIC", title: "Таблица основных аккордов", meta: "1 страница", thumb: "green-light" },
  { id: "m6", slug: "melodii-dlya-ukulele", type: "SHEET_MUSIC", title: "Мелодии для укулеле", meta: "4 страницы", thumb: "sage" },
];

export const materialTypeLabels: Record<Material["type"], string> = {
  VIDEO: "Видео",
  SHEET_MUSIC: "Ноты PDF",
  LYRICS: "Текст и аккорды",
};
