// Типы по черновику модели данных из REQUIREMENTS.md.
// Пока данные приходят из src/lib/mock, позже — из Prisma.

export type Attachment = {
  id: string;
  title: string;
  /** Подпись под названием, например «PDF · 1,2 МБ» */
  meta: string;
  href: string;
};

export type Lesson = {
  id: string;
  slug: string;
  order: number;
  title: string;
  isFree: boolean;
  durationLabel?: string;
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
  modules: Module[];
};

export type MaterialType = "VIDEO" | "SHEET_MUSIC" | "LYRICS";

export type Material = {
  id: string;
  slug: string;
  type: MaterialType;
  title: string;
  meta: string;
  thumb: "peach" | "peach-light" | "green" | "green-light" | "sage" | "neutral";
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Enrollment = {
  courseId: string;
  purchasedAt: string;
  completedLessons: number;
  currentLessonSlug: string;
};
