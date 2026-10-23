"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { allLessons } from "@/lib/mock/course";
import { getSessionUser } from "@/lib/session";

/**
 * The "next" button below a lesson: marks the lesson completed and goes to the next lesson,
 * to payment (the next lesson is paid and there is no subscription) or to the account (last lesson).
 * Marked only for a signed-in user and only for a lesson open to them.
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
