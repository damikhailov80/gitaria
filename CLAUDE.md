# Gitaria

Website of the guitar school **gitaria.pl**: home page, online course «Гитара с нуля» ("Guitar from scratch", the first lesson is free),
open materials, tuner, metronome, personal account, payment via Stripe.

## Current stage

- Layout of all screens according to the design.
- Users — in PostgreSQL (Prisma 7 + Better Auth). Sign-in and sign-up via Google only.
  Roles USER/ADMIN (admins — `ADMIN_EMAILS` in `src/lib/auth.ts`), subscription flag, blocking, soft deletion.
  `/account*` and `/admin/*` require sign-in; `/admin/users` — admins only.
  Favorite materials are in the database (`FavoriteMaterial`); the heart button on `/materials` is only for signed-in users, the list is in the account (`/account/materials`).
- All other data — mocks from `src/lib/mock/`. Stripe will be connected later.
- All videos (lessons and materials) are on YouTube, referenced by `youtubeId`.
- Paid lessons are open only with a subscription (`hasSubscription`); everyone else sees a placeholder on the lesson page — no video, text or PDF.
  The course is not offered to someone who has already bought it: no price card on `/course`, `/checkout` redirects to `/account`.
- Course progress is in the database (`LessonProgress`): a lesson is marked completed when a signed-in user moves on via the button below it
  («Смотреть урок N», «Открыть курс» — to payment, on the last one — «Завершить курс»).
  The account page (`/account`) shows only progress: start the course / continue / next — after purchase / course completed.
- Tuner and metronome are working (Web Audio API).
- The «Записаться на урок» button (offline lessons) opens the teacher's Telegram (`telegramHref` in `src/lib/mock/school.ts`).

## Stack and commands

Next.js 16 (App Router, TypeScript, Cache Components), React 19, CSS Modules, no Tailwind.

```bash
npm run db:up       # PostgreSQL in Docker (docker-compose.yml)
npm run db:migrate  # Prisma migrations (prisma migrate dev)
npm run db:studio   # Prisma Studio — database data in the browser
npm run dev     # dev server
npm run build   # build + type check
npm run lint    # ESLint
```

## Structure

```
src/app/                    pages
  page.tsx                  home page
  course/                   course page; [lessonSlug]/ — lesson
  materials/                open materials (client-side filter)
  tools/tuner/              tuner (microphone + pitchy)
  tools/metronome/          metronome
  account/ checkout/ login/ account (+ materials/ — favorites, settings/ — account deletion), payment, Google sign-in
  privacy/                  privacy policy (GDPR); links — in the footer and on /login
  admin/users/              users: subscription and blocking (ADMIN only)
  api/auth/[...all]/        Better Auth handler
src/components/             shared components (Header, Logo, Icon, LessonRow, …)
src/lib/auth.ts             Better Auth config (Google, hooks: admin role, blocking, restoration)
src/lib/session.ts          getCurrentUser() / requireAdmin() — only inside <Suspense>
src/lib/db.ts               Prisma Client; schema — prisma/schema.prisma, client is generated into src/generated/
src/lib/types.ts            data types (course, materials, user)
src/lib/mock/               mocks: course, materials, school, user
src/lib/audio/              pitch.ts (frequency → note/cents), tunings.ts, metronome.ts (scheduler)
design/                     PNG screens of the design from Claude Design — the layout reference
public/materials/shared/    public materials: sheet music PDFs (pdf/) and their covers (covers/), images (images/); the list — src/lib/mock/materials.json
                            (videos are listed there too: YouTube only, by youtubeId; watched in the VideoDialog modal)
public/materials/course/    private lesson materials: lesson-N/
public/logo*.svg            logo: full, mark, wordmark (vectorized from the source JPEG); favicon/icon/apple-icon — in src/app/
```

## Rules

- **Do only what was asked.** Do not add features, sections, pages or requirements beyond the request. If something seems necessary — ask.
- Colors — only via CSS variables from `src/app/globals.css` (`--color-*`). No hex in components.
  Shared classes are there too: `.btn`, `.tag`, `.segmented`, `.input`, `.eyebrow`, `.container`.
- Layout follows the design in `design/`; on narrow screens columns stack into one, side padding 16px.
- The interface is in Russian only. Prices in złoty (`formatPrice` from `src/lib/mock/course.ts`).
- Documentation, agent instructions and commit messages — in English.
- Pages get data from mocks via functions/constants in `src/lib/mock`, so they can later be replaced with Prisma without reworking the layout.
- **Materials are public and private.** Public ones (open materials) go in `public/materials/shared/`,
  with meaningful English names (`simply-guitar-book-one.pdf`). Private ones (lesson materials) go in
  `public/materials/course/lesson-N/`, named with random hashes so they cannot be found by guessing links.
  A lesson may also link to public materials from `shared/`.
- **Clean up after yourself.** After checks, delete temporary files (screenshots, Playwright logs, scripts) and stop servers started for checking. Temporary files go in the scratchpad, not in the project.
