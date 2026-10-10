This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## База данных: запуск, миграции, сид

Локально база — PostgreSQL 17 в Docker (`docker-compose.yml`), ORM — Prisma 7. Схема — `prisma/schema.prisma`,
миграции — `prisma/migrations/`. Нужен запущенный Docker Desktop.

Первый запуск:

```bash
cp .env.example .env.local  # заполнить BETTER_AUTH_SECRET и GOOGLE_* (см. ниже)
npm install             # заодно генерирует Prisma Client в src/generated/ (postinstall)
npm run db:up           # поднять PostgreSQL в Docker (порт 5432, данные в томе pgdata)
npm run db:migrate      # применить миграции к базе
npm run dev             # http://localhost:3000
```

Сида нет, он не нужен. Пользователи появляются сами при первом входе через Google. Администраторы
(d.a.mikhailov80@gmail.com, natahasim.ns@gmail.com) получают роль ADMIN автоматически при первом входе —
список в `ADMIN_EMAILS` в `src/lib/auth.ts`.

Полезные команды:

```bash
npm run db:migrate -- --name add_something   # после правки schema.prisma: создать и применить миграцию
npx prisma generate                          # перегенерировать Prisma Client
npm run db:studio                            # Prisma Studio: посмотреть и поправить данные в браузере
npx prisma migrate reset                     # стереть базу и накатить миграции заново (все данные пропадут)
npx prisma migrate deploy                    # на продакшене: применить готовые миграции
docker compose down                          # остановить базу (данные сохранятся в томе)
```

## Вход на сайт: Better Auth

[Better Auth](https://www.better-auth.com) — библиотека, через которую сделан вход на сайт. Она проводит
пользователя через Google, создаёт его запись в базе, ставит браузеру cookie сессии, а при выходе удаляет сессию.
Она бесплатная, с открытым кодом и работает внутри нашего сайта, а не как внешний сервис. Данные хранятся в нашей
PostgreSQL, в таблицах `user`, `session`, `account`, `verification`. Конфиг — `src/lib/auth.ts`.

Настройки в `.env.local`:

- **`BETTER_AUTH_SECRET`** — секретный ключ, которым подписываются cookie сессий, чтобы их нельзя было подделать.
  Это случайная строка, её никому нельзя показывать и нельзя коммитить. Создаётся командой `openssl rand -base64 32`.
  Для продакшена нужна отдельная, своя строка. Если её поменять, все пользователи просто выйдут из кабинета
  и войдут заново.
- **`BETTER_AUTH_URL`** — адрес сайта. Из него библиотека собирает адрес возврата после Google
  (`…/api/auth/callback/google`). Локально это `http://localhost:3000`, на продакшене — `https://gitaria.pl`.

Почему не Auth.js: команда Better Auth взяла Auth.js под своё крыло, и теперь он только поддерживается, без развития.
Для новых проектов они советуют Better Auth.

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
