import { Header } from "@/components/Header";
import { MaterialsCatalog } from "./MaterialsCatalog";
import styles from "./page.module.css";

export const metadata = { title: "Материалы — Gitaria" };

export default function MaterialsPage() {
  return (
    <>
      <Header action="login" />
      <main className={`container ${styles.page}`}>
        <MaterialsCatalog />
      </main>
    </>
  );
}
