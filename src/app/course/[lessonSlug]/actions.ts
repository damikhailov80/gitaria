"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { allLessons } from "@/lib/mock/course";
import { getSessionUser } from "@/lib/session";

/**
 * Кнопка «дальше» под уроком: отмечает урок пройденным и ведёт на следующий урок,
 * к оплате (следующий урок платный, подписки нет) или в кабинет (урок последний).
 * Отметка — только у вошедшего и только у открытого ему урока.
 */
export async function completeLesson(lessonId: string, to: "next" | "checkout") {
  const lesson = allLessons.find((l) => l.id === lessonId);
  if (!lesson) return;

  const user = await getSessionUser();
  if (user && (lesson.isFree || user.hasSubscription)) {
    const key = { userId: user.id, lessonId };
    await db.lessonProgress.upsert({ where: { userId_lessonId: key }, create: key, update: {} });
  }

  const next = allLessons[lesson.order];
  redirect(to === "checkout" ? "/checkout" : next ? `/course/${next.slug}` : "/account");
}
