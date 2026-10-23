import type { Course, Lesson, Module } from "@/lib/types";
import data from "./course.json";

/** Structure of course.json: introduction + modules → lessons; lesson numbers and material captions are computed here.
 *  A material with youtubeId is a video, with pages — a PDF, otherwise — an image. */
type LessonData = Omit<Lesson, "id" | "order" | "isFree" | "attachments"> & {
  attachments?: (
    | { id: string; title: string; pages?: number; file: string }
    | { id: string; title: string; youtubeId: string; durationLabel: string }
  )[];
};

type CourseData = {
  intro: LessonData[];
  modules: {
    id: string;
    title: string;
    lessons: LessonData[];
  }[];
};

const intro: Lesson[] = (data as CourseData).intro.map((l, i) =>
  i === 0
    ? { ...l, id: "l0", order: 0, isFree: true, attachments: undefined }
    : { ...l, id: `l0-${l.slug}`, order: 0, isFree: false, icon: "play", attachments: undefined },
);

const lessons: Lesson[] = [];

const modules: Module[] = (data as CourseData).modules.map((m, i) => ({
  id: m.id,
  order: i + 1,
  title: m.title,
  lessons: m.lessons.map(({ attachments, ...l }) => {
    const order = lessons.length + 1;
    const lesson: Lesson = {
      ...l,
      id: `l${order}`,
      order,
      isFree: order === 1,
      attachments: attachments?.map((a) => {
        if ("youtubeId" in a) {
          const { durationLabel, ...rest } = a;
          return { ...rest, kind: "video", meta: `Видео · ${durationLabel}` };
        }
        const { pages, file, ...rest } = a;
        return pages
          ? { ...rest, kind: "pdf", meta: `PDF · ${pages} стр.`, href: file }
          : { ...rest, kind: "image", meta: `Изображение · ${file.split(".").pop()!.toUpperCase()}`, href: file };
      }),
    };
    lessons.push(lesson);
    return lesson;
  }),
}));

export const course: Course = {
  id: "c1",
  slug: "gitara-s-nulya",
  title: "Гитара с нуля",
  description:
    "20 уроков в двух частях: от посадки и правой руки до гамм, позиций и пьес под минусовку. К каждому уроку — видео, текстовое объяснение и ноты в PDF.",
  highlights: ["20 видеоуроков", "Ноты и табы в PDF", "Доступ навсегда"],
  priceAmount: 19900,
  currency: "pln",
  vatAmount: 3721,
  intro,
  modules,
};

export const allLessons = lessons;

export function getLesson(slug: string) {
  const introLesson = intro.find((l) => l.slug === slug);
  if (introLesson) return { lesson: introLesson, module: null };
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return null;
  const lessonModule = modules.find((m) => m.lessons.includes(lesson))!;
  return { lesson, module: lessonModule };
}

/** Price in złoty for display: 29900 → «299 zł», with grosze → «299,00 zł» */
export function formatPrice(amount: number, withGrosze = false): string {
  const value = amount / 100;
  return `${value.toLocaleString("ru-RU", {
    minimumFractionDigits: withGrosze ? 2 : 0,
    maximumFractionDigits: 2,
  })} zł`;
}
