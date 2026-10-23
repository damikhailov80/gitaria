// Типы данных сайта.
// Пока данные приходят из src/lib/mock, позже — из Prisma.

import type { IconName } from "@/components/Icon";

export type Attachment = {
  id: string;
  title: string;
  /** Подпись под названием, например «PDF · 1,2 МБ» */
  meta: string;
} & ({ kind: "pdf" | "image"; href: string } | { kind: "video"; /** id видео на YouTube */ youtubeId: string });

export type Lesson = {
  id: string;
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  /** Значок вместо номера в списке уроков */
  icon?: IconName;
  durationLabel?: string;
  /** id видео на YouTube */
  youtubeId?: string;
  /** Абзацы основного текста урока */
  content?: string[];
  /** Блок «Что сделать после урока» */
  homework?: string;
  attachments?: Attachment[];
};

export type Module = {
  id: string;
  order: number;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  priceAmount: number;
  currency: "pln";
  vatAmount: number;
  /** Вступление вне модулей, не входит в счёт уроков: урок 0 (бесплатный), затем видео для купивших — со значком вместо номера */
  intro: Lesson[];
  modules: Module[];
};

export type MaterialType = "VIDEO" | "SHEET_MUSIC" | "IMAGE";

export type Material = {
  id: string;
  slug: string;
  type: MaterialType;
  title: string;
  meta: string;
  author?: string;
  thumb?: "peach" | "peach-light" | "green" | "green-light" | "sage" | "neutral";
  /** Путь к файлу в public/ */
  file?: string;
  /** Путь к обложке в public/ или URL превью YouTube */
  cover?: string;
  /** id видео на YouTube */
  youtubeId?: string;
};

export type Role = "USER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  hasSubscription: boolean;
};
