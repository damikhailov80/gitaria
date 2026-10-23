import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import type { User } from "@/lib/types";
import { auth } from "./auth";
import { db } from "./db";

/**
 * The signed-in user, or null — without a session, and also for a blocked
 * or deleted account.
 * Reads request headers, so call it only inside <Suspense>.
 */
export const getSessionUser = cache(async (): Promise<User | null> => {
  // getSession checks session expiry via new Date() — without connection() Next.js
  // complains about "current time during prerender" (e.g. on a lesson 404).
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

/** The current user; without sign-in — redirect to /login. Only inside <Suspense>. */
export async function getCurrentUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** The current admin user; everyone else gets a 404. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") notFound();
  return user;
}
