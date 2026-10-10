"use server";

import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { materials } from "@/lib/mock/materials";
import { getSessionUser } from "@/lib/session";

export async function setFavorite(materialId: string, favorite: boolean) {
  const user = await getSessionUser();
  if (!user || !materials.some((m) => m.id === materialId)) return;

  const key = { userId: user.id, materialId };
  if (favorite) {
    await db.favoriteMaterial.upsert({ where: { userId_materialId: key }, create: key, update: {} });
  } else {
    await db.favoriteMaterial.deleteMany({ where: key });
  }
  refresh();
}
