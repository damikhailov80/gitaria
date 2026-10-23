import { Suspense } from "react";
import { Header } from "@/components/Header";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { MaterialsCatalog } from "./MaterialsCatalog";
import styles from "./page.module.css";

export const metadata = { title: "Материалы — Gitaria" };

export default function MaterialsPage() {
  return (
    <>
      <Header />
      <main className={`container ${styles.page}`}>
        {/* While the session is being read, the catalog is shown without favorite buttons */}
        <Suspense fallback={<MaterialsCatalog />}>
          <CatalogWithFavorites />
        </Suspense>
      </main>
    </>
  );
}

async function CatalogWithFavorites() {
  const user = await getSessionUser();
  if (!user) return <MaterialsCatalog />;

  const favorites = await db.favoriteMaterial.findMany({ where: { userId: user.id }, select: { materialId: true } });
  return <MaterialsCatalog favoriteIds={favorites.map((f) => f.materialId)} />;
}
