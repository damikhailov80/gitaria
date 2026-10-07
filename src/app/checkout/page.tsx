import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { course, formatPrice } from "@/lib/mock/course";
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
      <main className={`container ${styles.layout}`}>
        <div>
          <h1 className={styles.title}>Оплата курса</h1>
          <CheckoutForm price={formatPrice(course.priceAmount)} />
        </div>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>{course.title}</h2>
          <p className={styles.summaryNote}>24 урока · материалы PDF · доступ навсегда</p>
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
    </>
  );
}
