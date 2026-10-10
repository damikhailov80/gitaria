export const teacher = {
  name: "Наталья",
  photo: "/images/teacher.jpg",
};

export const history = [
  { date: "9 января 2025", text: "Школа открылась", marker: "accent" },
  { date: "1 июня", text: "Первый концерт учеников", marker: "green" },
  { date: "Сейчас", text: "Онлайн-курс из 24 уроков", marker: "ring" },
] as const;

export const socials = [
  { id: "tiktok", name: "TikTok", caption: "Короткие приёмы", href: "#" },
  { id: "instagram", name: "Instagram", caption: "Жизнь школы", href: "#" },
  { id: "telegram", name: "Telegram", caption: "Ноты и новости", href: "#" },
  { id: "youtube", name: "YouTube", caption: "Полные разборы", href: "#" },
] as const;

export type SocialId = (typeof socials)[number]["id"];

/** Контакт для запросов о персональных данных (страница /privacy). */
export const privacyContact = {
  email: "natahasim.ns@gmail.com",
};
