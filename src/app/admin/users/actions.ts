"use server";

import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

// Менять можно только обычных пользователей: условие role: "USER" защищает администраторов.

export async function setSubscription(userId: string, hasSubscription: boolean) {
  await requireAdmin();
  await db.user.updateMany({ where: { id: userId, role: "USER" }, data: { hasSubscription } });
  refresh();
}

export async function setBlocked(userId: string, isBlocked: boolean) {
  await requireAdmin();
  const { count } = await db.user.updateMany({ where: { id: userId, role: "USER" }, data: { isBlocked } });
  // Заблокированный сразу выходит из кабинета
  if (count && isBlocked) await db.session.deleteMany({ where: { userId } });
  refresh();
}
