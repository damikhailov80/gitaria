"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

/** Marks the account as deleted and ends all sessions. Signing in with Google again restores it. */
export async function deleteAccount() {
  const user = await getCurrentUser();
  await auth.api.signOut({ headers: await headers() });
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { deletedAt: new Date() } }),
    db.session.deleteMany({ where: { userId: user.id } }),
  ]);
  redirect("/");
}
