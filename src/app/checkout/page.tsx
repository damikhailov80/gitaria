import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { allLessons, course, formatPrice } from "@/lib/mock/course";
import { getSessionUser } from "@/lib/session";
import { CheckoutForm } from "./CheckoutForm";
import styles from "./page.module.css";

export const metadata = { title: "Оплата курса — Gitaria" };

export default function CheckoutPage() {
  return (
    <>
      <header className={`container ${styles.header}`}>
        <Logo />
        <Link href="/course" className={styles.back}>
          <Icon name="arrowLeft" size={20} />
          Вернуться к курсу
        </Link>
      </header>
      <Suspense>
        <CheckoutContent />
      </Suspense>
    </>
  );
}

async function CheckoutContent() {
  // Курс уже куплен — второй раз не продаём
  const user = await getSessionUser();
  if (user?.hasSubscription) redirect("/account");

  return (
    <main className={`container ${styles.layout}`}>
      <div>
        <h1 className={styles.title}>Оплата курса</h1>
        <CheckoutForm price={formatPrice(course.priceAmount)} />
      </div>

      <aside className={styles.summary}>
        <h2 className={styles.summaryTitle}>{course.title}</h2>
        <p className={styles.summaryNote}>{allLessons.length} уроков · материалы PDF · доступ навсегда</p>
        <dl className={styles.lines}>
          <div>
            <dt>Курс</dt>
            <dd>{formatPrice(course.priceAmount, true)}</dd>
          </div>
          <div className={styles.vat}>
            <dt>в т.ч. VAT</dt>
            <dd>{formatPrice(course.vatAmount, true)}</dd>
          </div>
          <div className={styles.total}>
            <dt>Итого</dt>
            <dd>{formatPrice(course.priceAmount)}</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
