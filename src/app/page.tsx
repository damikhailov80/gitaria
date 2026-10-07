import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { SocialCards } from "@/components/SocialCards";
import { allLessons, course, formatPrice } from "@/lib/mock/course";
import { history, teacher } from "@/lib/mock/school";
import styles from "./page.module.css";

export default function HomePage() {
  const freeLessonHref = `/course/${allLessons[0].slug}`;

  return (
    <>
      <Header action="trial" />
      <main className="container">
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>Здравствуйте, меня зовут {teacher.name}</h1>
            <p className={styles.lead}>
              9 января 2025 года я открыла школу Gitaria в Гданьске. Ученики у меня разные и самые лучшие:
              занимаюсь с любым возрастом и любым уровнем.
            </p>
            <p className={styles.text}>
              Играем на классической и акустической гитаре, электрогитаре и укулеле. Направления — классика и всё,
              что душа хочет.
            </p>
            <div className={styles.actions}>
              {/* Куда ведёт запись на офлайн-урок — пока не решено */}
              <button type="button" className="btn btn-primary">
                Записаться на урок
              </button>
              <Link href={freeLessonHref} className="btn btn-secondary">
                Бесплатный онлайн-урок
              </Link>
            </div>
          </div>

          <aside className={styles.heroSide}>
            <Image
              src={teacher.photo}
              alt={`${teacher.name} с гитарой`}
              width={240}
              height={289}
              className={styles.photo}
              priority
            />
            <p className="eyebrow">История школы</p>
            <ol className={styles.timeline}>
              {history.map((item) => (
                <li key={item.date} className={styles.timelineItem}>
                  <span className={`${styles.marker} ${styles[item.marker]}`} aria-hidden="true" />
                  <span className={styles.timelineDate}>{item.date}</span>
                  <span className={styles.timelineText}>{item.text}</span>
                </li>
              ))}
            </ol>
          </aside>
        </section>

        <section className={styles.ways}>
          <h2 className={styles.sectionTitle}>Два способа учиться</h2>
          <div className={styles.wayGrid}>
            <article className={`${styles.wayCard} ${styles.offline}`}>
              <span className="tag tag-neutral">Офлайн · Гданьск</span>
              <h3 className={styles.wayTitle}>Индивидуальные уроки в студии</h3>
              <p className={styles.wayText}>
                Занятия лично с Натальей. Классическая и акустическая гитара, электрогитара, укулеле. Для детей и
                взрослых, с любого уровня.
              </p>
              <ul className={styles.checks}>
                <li>
                  <Icon name="check" size={20} />
                  Программа под ваши цели и любимую музыку
                </li>
                <li>
                  <Icon name="check" size={20} />
                  Концерты учеников
                </li>
              </ul>
              <div className={styles.actions}>
                <button type="button" className="btn btn-primary">
                  Записаться на урок
                </button>
              </div>
            </article>

            <article className={`${styles.wayCard} ${styles.online}`}>
              <span className={`tag tag-neutral ${styles.onlineTag}`}>Онлайн · в своём темпе</span>
              <h3 className={styles.wayTitle}>Видеокурс «{course.title}»</h3>
              <p className={styles.wayText}>
                24 урока с видео, объяснениями и нотами в PDF. Занимайтесь из любого города, когда удобно.
              </p>
              <ul className={styles.checks}>
                <li>
                  <Icon name="check" size={20} />
                  Первый урок бесплатно
                </li>
                <li>
                  <Icon name="check" size={20} />
                  {formatPrice(course.priceAmount)} один раз · доступ навсегда
                </li>
              </ul>
              <div className={styles.actions}>
                <Link href={freeLessonHref} className="btn btn-primary">
                  Смотреть бесплатный урок
                </Link>
                <Link href="/course" className="btn btn-secondary">
                  Программа курса
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className={styles.socials} aria-label="Соцсети">
          <SocialCards />
        </section>
      </main>
      <Footer />
    </>
  );
}
