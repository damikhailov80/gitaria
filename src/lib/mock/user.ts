import type { User } from "@/lib/types";

// For now only needed by the payment form; the account takes the user from the database.
export const user: User = {
  id: "u1",
  name: "Анна",
  email: "anna@example.com",
  role: "USER",
  hasSubscription: true,
};
