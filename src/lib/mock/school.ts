export const teacher = {
  name: "Наталья",
  photo: "/images/teacher.jpg",
};

export const history = [
  { date: "9 января 2025", text: "Школа открылась", marker: "accent" },
  { date: "1 июня", text: "Первый концерт учеников", marker: "green" },
  { date: "Сейчас", text: "Онлайн-курс из 24 уроков", marker: "ring" },
] as const;

/** Telegram преподавателя: туда же ведёт запись на офлайн-урок. */
export const telegramHref = "https://t.me/natahasim_ns";

export const socials = [
  {
    id: "tiktok",
    name: "TikTok",
    caption: "Короткие приёмы",
    href: "https://www.tiktok.com/@user66507130498201",
  },
  {
    id: "instagram",
    name: "Instagram",
    caption: "Жизнь школы",
    href: "https://www.instagram.com/lekcje_gitara_gdansk/",
  },
  { id: "telegram", name: "Telegram", caption: "Ноты и новости", href: telegramHref },
  {
    id: "youtube",
    name: "YouTube",
    caption: "Полные разборы",
    href: "https://www.youtube.com/channel/UCwshglBngY7RomreTi0O6yQ",
  },
  {
    id: "facebook",
    name: "Facebook",
    caption: "Новости школы",
    href: "https://www.facebook.com/people/%D0%93%D0%B8%D1%82%D0%B0%D1%80%D0%B0%D0%A3%D1%80%D0%BE%D0%BA%D0%B8-%D0%9D%D0%B0%D1%82%D0%B0%D1%88%D0%B0/100011715082602/",
  },
] as const;

export type SocialId = (typeof socials)[number]["id"];

/** Контакт для запросов о персональных данных (страница /privacy). */
export const privacyContact = {
  email: "natahasim.ns@gmail.com",
};
