import type { User } from "@/lib/types";

// Пока нужен только форме оплаты; в кабинете пользователь берётся из базы.
export const user: User = {
  id: "u1",
  name: "Анна",
  email: "anna@example.com",
  role: "USER",
  hasSubscription: true,
};
