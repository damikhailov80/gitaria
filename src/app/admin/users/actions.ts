"use server";

import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

// Only regular users can be changed: the role: "USER" condition protects administrators.
// The exception is the subscription: an admin can grant and revoke it for themselves.

export async function setSubscription(userId: string, hasSubscription: boolean) {
  const admin = await requireAdmin();
  const where = userId === admin.id ? { id: userId } : { id: userId, role: "USER" as const };
  await db.user.updateMany({ where, data: { hasSubscription } });
  refresh();
}

export async function setBlocked(userId: string, isBlocked: boolean) {
  await requireAdmin();
  const { count } = await db.user.updateMany({ where: { id: userId, role: "USER" }, data: { isBlocked } });
  // A blocked user is signed out right away
  if (count && isBlocked) await db.session.deleteMany({ where: { userId } });
  refresh();
}
