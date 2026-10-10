import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import type { User } from "@/lib/types";
import { auth } from "./auth";
import { db } from "./db";

/**
 * Вошедший пользователь или null — без сессии, а также для заблокированного
 * или удалённого аккаунта.
 * Читает заголовки запроса, поэтому вызывать только внутри <Suspense>.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  // getSession сверяет срок сессии через new Date() — без connection() Next.js
  // ругается на «текущее время при пререндере» (например, на 404 урока).
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.isBlocked || user.deletedAt) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    hasSubscription: user.hasSubscription,
  };
});

/** Текущий пользователь; без входа — редирект на /login. Только внутри <Suspense>. */
export async function getCurrentUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** Текущий пользователь-администратор; остальным — 404. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") notFound();
  return user;
}
