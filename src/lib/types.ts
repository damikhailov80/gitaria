// Site data types.
// For now data comes from src/lib/mock, later — from Prisma.

import type { IconName } from "@/components/Icon";

export type Attachment = {
  id: string;
  title: string;
  /** Caption under the title, e.g. «PDF · 1,2 МБ» */
  meta: string;
} & ({ kind: "pdf" | "image"; href: string } | { kind: "video"; /** YouTube video id */ youtubeId: string });

export type Lesson = {
  id: string;
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  /** Icon instead of a number in the lesson list */
  icon?: IconName;
  durationLabel?: string;
  /** YouTube video id */
  youtubeId?: string;
  /** Paragraphs of the main lesson text */
  content?: string[];
  /** The «Что сделать после урока» (What to do after the lesson) block */
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
  /** Introduction outside the modules, not counted as lessons: lesson 0 (free), then videos for buyers — with an icon instead of a number */
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
  /** Path to the file in public/ */
  file?: string;
  /** Path to the cover in public/ or a YouTube thumbnail URL */
  cover?: string;
  /** YouTube video id */
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
