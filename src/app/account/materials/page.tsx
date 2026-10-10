import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { MaterialGrid } from "@/components/MaterialGrid";
import { db } from "@/lib/db";
import { materials } from "@/lib/mock/materials";
import { getCurrentUser } from "@/lib/session";
import styles from "./page.module.css";

export const metadata = { title: "Мои материалы — Gitaria" };

// Данные пользователя читаются из сессии — только внутри <Suspense>.
export default function MyMaterialsPage() {
  return (
    <Suspense>
      <MyMaterials />
    </Suspense>
  );
}

async function MyMaterials() {
  const user = await getCurrentUser();
  const rows = await db.favoriteMaterial.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { materialId: true },
  });
  // Материал могли убрать из списка — такие записи просто не показываем
  const favorites = rows.flatMap((f) => materials.find((m) => m.id === f.materialId) ?? []);

  return (
    <>
      <h1 className={styles.title}>Мои материалы</h1>
      {favorites.length ? (
        <MaterialGrid
          materials={favorites}
          favoriteIds={favorites.map((m) => m.id)}
          className={styles.grid}
        />
      ) : (
        <>
          <p className={styles.empty}>Отмечайте материалы сердечком — они появятся здесь.</p>
          <Link href="/materials" className={styles.link}>
            Все материалы <Icon name="arrowRight" size={20} />
          </Link>
        </>
      )}
    </>
  );
}
