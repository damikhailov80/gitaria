import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

/** These users get the admin role on their first sign-in. */
const ADMIN_EMAILS = ["d.a.mikhailov80@gmail.com", "natahasim.ns@gmail.com"];

/** Error code in /login?error=… when a blocked user signs in. */
export const BLOCKED_ERROR = "ACCOUNT_BLOCKED";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  // Sign-in and sign-up — Google only
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
    },
  },
  user: {
    additionalFields: {
      role: { type: ["USER", "ADMIN"], input: false, defaultValue: "USER" },
      hasSubscription: { type: "boolean", input: false, defaultValue: false },
      isBlocked: { type: "boolean", input: false, defaultValue: false },
      deletedAt: { type: "date", input: false, required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            return { data: { ...user, role: "ADMIN" } };
          }
        },
      },
    },
    session: {
      create: {
        async before(session) {
          const user = await db.user.findUnique({ where: { id: session.userId } });
          if (!user) return;
          if (user.isBlocked) {
            throw APIError.from("FORBIDDEN", { message: "Аккаунт заблокирован", code: BLOCKED_ERROR });
          }
          // A deleted account is restored on the next sign-in
          if (user.deletedAt) {
            await db.user.update({ where: { id: user.id }, data: { deletedAt: null } });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
