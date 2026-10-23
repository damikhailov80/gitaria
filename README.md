This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Database: setup, migrations, seed

Locally the database is PostgreSQL 17 in Docker (`docker-compose.yml`), the ORM is Prisma 7. Schema — `prisma/schema.prisma`,
migrations — `prisma/migrations/`. Docker Desktop must be running.

First run:

```bash
cp .env.example .env.local  # fill in BETTER_AUTH_SECRET and GOOGLE_* (see below)
npm install             # also generates Prisma Client into src/generated/ (postinstall)
npm run db:up           # start PostgreSQL in Docker (port 5432, data in the pgdata volume)
npm run db:migrate      # apply migrations to the database
npm run dev             # http://localhost:3000
```

There is no seed and none is needed. Users are created automatically on their first Google sign-in. Administrators
(d.a.mikhailov80@gmail.com, natahasim.ns@gmail.com) get the ADMIN role automatically on first sign-in —
the list is in `ADMIN_EMAILS` in `src/lib/auth.ts`.

Useful commands:

```bash
npm run db:migrate -- --name add_something   # after editing schema.prisma: create and apply a migration
npx prisma generate                          # regenerate Prisma Client
npm run db:studio                            # Prisma Studio: view and edit data in the browser
npx prisma migrate reset                     # wipe the database and re-apply migrations (all data is lost)
docker compose down                          # stop the database (data is kept in the volume)
```

### Migrations in production

In production use only `prisma migrate deploy`, not `migrate dev`. It applies the migrations from
`prisma/migrations/` that have not been applied yet, and does not generate or reset anything.

`prisma.config.ts` always reads `.env.local`, but environment variables take precedence. So the production
`DATABASE_URL` is passed from `.env.prod` via the environment, in a subshell (parentheses), so it does not linger in the terminal:

```bash
(set -a; source .env.prod; set +a; npx prisma migrate status)   # what is applied and what is not
(set -a; source .env.prod; set +a; npx prisma migrate deploy)   # apply
```

- Migrate first, then deploy the code.
- If the database is behind a connection pooler (Neon, Supabase, etc.), migrations need the direct URL, not the pooled one.

## Sign-in: Better Auth

[Better Auth](https://www.better-auth.com) is the library that powers sign-in on the site. It takes the
user through Google, creates their record in the database, sets the session cookie in the browser, and deletes the session on sign-out.
It is free, open source, and runs inside our site rather than as an external service. Data is stored in our
PostgreSQL, in the `user`, `session`, `account`, `verification` tables. Config — `src/lib/auth.ts`.

Settings in `.env.local`:

- **`BETTER_AUTH_SECRET`** — the secret key used to sign session cookies so they cannot be forged.
  It is a random string; never show it to anyone and never commit it. Generate it with `openssl rand -base64 32`.
  Production needs its own separate string. If it is changed, all users are simply signed out
  and sign in again.
- **`BETTER_AUTH_URL`** — the site URL. The library builds the Google callback URL from it
  (`…/api/auth/callback/google`). Locally it is `http://localhost:3000`, in production — `https://gitaria.pl`.

Why not Auth.js: the Better Auth team took Auth.js under its wing, and it is now only maintained, not developed further.
For new projects they recommend Better Auth.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
