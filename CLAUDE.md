# Gitaria

Сайт школы игры на гитаре **gitaria.pl**: главная, онлайн-курс «Гитара с нуля» (первый урок бесплатный),
открытые материалы, тюнер, метроном, личный кабинет, оплата через Stripe.

## Текущий этап

- Вёрстка всех экранов по макету.
- Пользователи — в PostgreSQL (Prisma 7 + Better Auth). Вход и регистрация только через Google.
  Роли USER/ADMIN (админы — `ADMIN_EMAILS` в `src/lib/auth.ts`), флаг подписки, блокировка, мягкое удаление.
  `/account*` и `/admin/*` требуют входа; `/admin/users` — только админам.
  Избранные материалы — в базе (`FavoriteMaterial`), кнопка-сердечко на `/materials` только для вошедших, список — в кабинете (`/account/materials`).
- Остальные данные — моки из `src/lib/mock/`. Stripe и видеохостинг подключим позже.
- Платные уроки открыты только с подпиской (`hasSubscription`); остальным на странице урока — заглушка без видео, текста и PDF.
- Тюнер и метроном — рабочие (Web Audio API).
- Кнопка «Записаться на урок» (офлайн-уроки) открывает Telegram преподавателя (`telegramHref` в `src/lib/mock/school.ts`).

## Стек и команды

Next.js 16 (App Router, TypeScript, Cache Components), React 19, CSS Modules, без Tailwind.

```bash
npm run db:up       # PostgreSQL в Docker (docker-compose.yml)
npm run db:migrate  # миграции Prisma (prisma migrate dev)
npm run db:studio   # Prisma Studio — данные базы в браузере
npm run dev     # dev-сервер
npm run build   # сборка + проверка типов
npm run lint    # ESLint
```

## Структура

```
src/app/                    страницы
  page.tsx                  главная
  course/                   страница курса; [lessonSlug]/ — урок
  materials/                открытые материалы (фильтр на клиенте)
  tools/tuner/              тюнер (микрофон + pitchy)
  tools/metronome/          метроном
  account/ checkout/ login/ кабинет (+ materials/ — избранное, settings/ — удаление аккаунта), оплата, вход через Google
  privacy/                  политика конфиденциальности (GDPR); ссылки — в футере и на /login
  admin/users/              пользователи: подписка и блокировка (только ADMIN)
  api/auth/[...all]/        обработчик Better Auth
src/components/             общие компоненты (Header, Logo, Icon, LessonRow, …)
src/lib/auth.ts             конфиг Better Auth (Google, хуки: роль админа, блокировка, восстановление)
src/lib/session.ts          getCurrentUser() / requireAdmin() — только внутри <Suspense>
src/lib/db.ts               Prisma Client; схема — prisma/schema.prisma, клиент генерируется в src/generated/
src/lib/types.ts            типы данных (курс, материалы, пользователь)
src/lib/mock/               моки: курс, материалы, школа, пользователь
src/lib/audio/              pitch.ts (частота → нота/центы), tunings.ts, metronome.ts (планировщик)
design/                     PNG-экраны макета из Claude Design — эталон вёрстки
public/materials/           PDF нот (pdf/) и их обложки (covers/); список — src/lib/mock/materials.json
                            (там же видео: только YouTube, по youtubeId; смотрятся в модальном окне VideoDialog)
public/logo*.svg            логотип: полный, знак, надпись (векторизован из исходного JPEG); favicon/icon/apple-icon — в src/app/
```

## Правила

- **Делать только то, что попросили.** Не добавлять фичи, разделы, страницы и требования сверх запроса. Если что-то кажется нужным — спросить.
- Цвета — только через CSS-переменные из `src/app/globals.css` (`--color-*`). Никаких hex в компонентах.
  Общие классы там же: `.btn`, `.tag`, `.segmented`, `.input`, `.eyebrow`, `.container`.
- Вёрстка по макету в `design/`; на узких экранах колонки складываются в одну, боковой отступ 16px.
- Интерфейс только на русском. Цены в злотых (`formatPrice` из `src/lib/mock/course.ts`).
- Страницы получают данные из моков через функции/константы `src/lib/mock`, чтобы потом заменить их на Prisma без переделки вёрстки.
- **Убирать за собой.** После проверок удалять временные файлы (скриншоты, логи Playwright, скрипты), останавливать запущенные для проверки серверы. Временное — в scratchpad, не в проекте.
