import type { Enrollment, User } from "@/lib/types";

export const user: User = {
  id: "u1",
  name: "Анна",
  email: "anna@example.com",
};

export const enrollment: Enrollment = {
  courseId: "c1",
  purchasedAt: "14 сентября 2026",
  completedLessons: 7,
  currentLessonSlug: "urok-8",
};

export const recentMaterials = [
  { id: "r1", title: "Упражнения, неделя 2", kind: "PDF", href: "#" },
  { id: "r2", title: "Таблица аккордов", kind: "PDF", href: "#" },
  { id: "r3", title: "Перебор «четвёрка»", kind: "PDF", href: "#" },
];
