import type { Course, Lesson, Module } from "@/lib/types";

const moduleTitles = ["Первые шаги", "Аккорды", "Ритм", "Ноты и пьесы"];

const lessonTitles = [
  "Знакомство с гитарой и посадка",
  "Настройка и названия струн",
  "Постановка правой руки",
  "Первые звуки: щипок",
  "Постановка левой руки",
  "Первая мелодия",
  "Что такое аккорд",
  "Am, Dm, E",
  "C, G и упрощённый F",
  "Смена аккордов без пауз",
  "Перебор «четвёрка»",
  "Песня целиком",
  "Счёт и длительности",
  "Бой «шестёрка»",
  "Работа с метрономом",
  "Синкопы",
  "Перебор «восьмёрка»",
  "Аккомпанемент к песне",
  "Ноты в первой позиции",
  "Чтение с листа",
  "Баррэ",
  "Этюд",
  "Пьеса для классической гитары",
  "Итоговое выступление",
];

const firstLesson: Partial<Lesson> = {
  durationLabel: "12:40",
  content: [
    "В этом уроке разберём, из чего состоит гитара, как правильно сесть и удобно держать инструмент. Хорошая посадка — основа, на которой держится всё остальное: без напряжения в плечах и запястьях играть легче и дольше.",
  ],
  homework:
    "Сядьте на край стула, поставьте левую ногу на подставку и найдите положение, в котором гриф смотрит чуть вверх. Посидите так 5 минут, проверяя, что плечи расслаблены.",
  attachments: [
    { id: "a1", title: "Строение гитары", meta: "PDF · 1,2 МБ", href: "#" },
    { id: "a2", title: "Упражнения, неделя 1", meta: "PDF · 640 КБ", href: "#" },
  ],
};

const lessons: Lesson[] = lessonTitles.map((title, i) => ({
  id: `l${i + 1}`,
  slug: `urok-${i + 1}`,
  order: i + 1,
  title,
  isFree: i === 0,
  ...(i === 0 ? firstLesson : {}),
}));

const modules: Module[] = moduleTitles.map((title, i) => ({
  id: `m${i + 1}`,
  order: i + 1,
  title,
  lessons: lessons.slice(i * 6, i * 6 + 6),
}));

export const course: Course = {
  id: "c1",
  slug: "gitara-s-nulya",
  title: "Гитара с нуля",
  description:
    "24 урока: от посадки и первых звуков до аккомпанемента и пьесы для классической гитары. К каждому уроку — видео, текстовое объяснение и материалы в PDF.",
  highlights: ["24 видеоурока", "Ноты и табы в PDF", "Доступ навсегда"],
  priceAmount: 29900,
  currency: "pln",
  vatAmount: 5591,
  modules,
};

export const allLessons = lessons;

export function getLesson(slug: string) {
  const lesson = lessons.find((l) => l.slug === slug);
  if (!lesson) return null;
  const lessonModule = modules.find((m) => m.lessons.includes(lesson))!;
  return { lesson, module: lessonModule };
}

/** Цена в злотых для отображения: 29900 → «299 zł», с копейками → «299,00 zł» */
export function formatPrice(amount: number, withGrosze = false): string {
  const value = amount / 100;
  return `${value.toLocaleString("ru-RU", {
    minimumFractionDigits: withGrosze ? 2 : 0,
    maximumFractionDigits: 2,
  })} zł`;
}
