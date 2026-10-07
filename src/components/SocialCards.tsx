import { socials } from "@/lib/mock/school";
import { Icon } from "./Icon";
import styles from "./SocialCards.module.css";

export function SocialCards() {
  return (
    <ul className={styles.grid}>
      {socials.map((s) => (
        <li key={s.id}>
          <a href={s.href} className={styles.card}>
            <Icon name={s.id} size={30} className={styles.icon} />
            <span className={styles.name}>{s.name}</span>
            <span className={styles.caption}>{s.caption}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
